import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const routeSource = fs.readFileSync("app/api/check/web/route.ts", "utf8");
const meteredSource = fs.readFileSync("app/api/check/metered/route.ts", "utf8");
const signalsSource = fs.readFileSync("lib/vonu-check/web-signals.ts", "utf8");
const enrichmentSource = fs.readFileSync("lib/vonu-check/web-enrichment.ts", "utf8");
const externalSource = fs.readFileSync("lib/vonu-check/web-external.ts", "utf8");

function requireSource(source, needle, label) {
  if (!source.includes(needle)) throw new Error(`${label}: missing ${JSON.stringify(needle)}`);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

requireSource(routeSource, "EXPLICIT_SCHEME", "explicit scheme guard");
requireSource(routeSource, "unsupported_protocol", "unsupported protocol rejection");
requireSource(routeSource, "credentials_not_allowed", "credential URL rejection");
requireSource(routeSource, "private_target", "private target rejection");
requireSource(routeSource, "dns_not_found", "DNS failure classification");
requireSource(routeSource, "dns_temporarily_unavailable", "transient DNS failure classification");
requireSource(routeSource, "x-vonu-analysis-billable", "non-billable inconclusive result marker");
requireSource(routeSource, "NON_BILLABLE_RESULT_ERRORS", "inconclusive network result set");
requireSource(meteredSource, "explicitlyNonBillable", "meter honours non-billable successful result");
requireSource(meteredSource, 'response.headers.get("x-vonu-analysis-billable") === "0"', "meter reads non-billable marker");
requireSource(signalsSource, "MAX_REDIRECTS", "redirect cap");
requireSource(signalsSource, "MAX_HTML_BYTES", "HTML byte cap");
requireSource(signalsSource, "FETCH_TIMEOUT_MS", "fetch timeout");
requireSource(signalsSource, "assertPublicHostname", "SSRF hostname guard");
requireSource(signalsSource, "resolve4", "DNS resolver IPv4 path");
requireSource(signalsSource, "resolve6", "DNS resolver IPv6 path");
requireSource(signalsSource, "DNS_RETRY_DELAYS_MS", "DNS retry backoff");
requireSource(signalsSource, "FETCH_RETRY_DELAYS_MS", "target fetch retry backoff");
requireSource(signalsSource, "TRANSIENT_FETCH_CODES", "transient target network classification");
requireSource(signalsSource, "externalForm", "external form signal");
requireSource(signalsSource, "punycode", "punycode signal");
requireSource(signalsSource, "noHttps", "HTTP signal");
requireSource(enrichmentSource, "lookupCentralUrlhaus", "URL reputation lookup");
requireSource(enrichmentSource, "lookupDomainAge", "domain age lookup");
requireSource(enrichmentSource, "Math.max(92, score)", "known malware risk floor");
requireSource(enrichmentSource, "strict-transport-security", "HSTS inspection");
requireSource(enrichmentSource, "content-security-policy", "CSP inspection");
requireSource(enrichmentSource, "resolveCaa", "CAA inspection");
requireSource(enrichmentSource, "security.txt", "security.txt inspection");

const compiled = ts.transpileModule(externalSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
  },
}).outputText;

const module = { exports: {} };
const context = {
  module,
  exports: module.exports,
  console,
  Set,
  String,
  Math,
  Date,
  URL,
  URLSearchParams,
  AbortSignal,
  fetch: async () => { throw new Error("network_not_allowed_in_contract"); },
  process: { env: {} },
};
vm.runInNewContext(compiled, context, { filename: "web-external.compiled.cjs" });

const { urlhausSignal, domainAgeSignal } = module.exports;

const reputationHit = urlhausSignal("es", {
  configured: true,
  attempted: true,
  matched: true,
  queryStatus: "ok",
  urlStatus: "online",
  threat: "malware_download",
  reference: null,
  tags: [],
});
assertEqual(reputationHit?.tone, "negative", "URLhaus match tone");
assertEqual(reputationHit?.weight, 55, "URLhaus match weight");

const reputationClear = urlhausSignal("es", {
  configured: true,
  attempted: true,
  matched: false,
  queryStatus: "no_results",
  urlStatus: null,
  threat: null,
  reference: null,
  tags: [],
});
assertEqual(reputationClear?.tone, "neutral", "URLhaus clear tone");
assertEqual(reputationClear?.weight, 0, "URLhaus clear weight");

const veryNew = domainAgeSignal("es", { attempted: true, registeredDomain: "example.test", registeredAt: null, ageDays: 10 });
assertEqual(veryNew?.id, "domain-age-very-new", "very new domain id");
assertEqual(veryNew?.weight, 18, "very new domain weight");

const newDomain = domainAgeSignal("es", { attempted: true, registeredDomain: "example.test", registeredAt: null, ageDays: 60 });
assertEqual(newDomain?.id, "domain-age-new", "new domain id");
assertEqual(newDomain?.weight, 10, "new domain weight");

const established = domainAgeSignal("es", { attempted: true, registeredDomain: "example.test", registeredAt: null, ageDays: 800 });
assertEqual(established?.tone, "positive", "established domain tone");
assertEqual(established?.weight, 0, "established domain weight");

console.log("VONU_WEB_CONTRACT_GREEN safety=1 reputation=2 domain_age=3 infra=4 resilience=5");
