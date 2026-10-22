import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync("lib/vonu-check/web-security.ts", "utf8");
const code = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
  },
}).outputText;
const module = { exports: {} };
vm.runInNewContext(code, {
  module,
  exports: module.exports,
  Date,
  URL,
  String,
  Boolean,
  Number,
  RegExp,
  Array,
  Object,
  Math,
}, { filename: "web-security.compiled.cjs" });
const { assessPublicWebSecurity } = module.exports;

function assert(condition, label) {
  if (!condition) throw new Error(`VONU_SECURITY_CONTRACT_FAILED: ${label}`);
}

function makeHeaders(values, cookies = []) {
  const normalized = Object.fromEntries(Object.entries(values).map(([k, v]) => [k.toLowerCase(), v]));
  return {
    get(name) { return normalized[name.toLowerCase()] ?? null; },
    getSetCookie() { return cookies; },
  };
}

const unsafe = assessPublicWebSecurity(
  makeHeaders(
    { "X-Powered-By": "PHP/7.4.33" },
    ["PHPSESSID=sensitive-secret-value; Path=/", "analytics=another-private-value; Path=/"],
  ),
  new URL("https://example.com/account.php"),
  200,
  true,
);
assert(unsafe.php.reportedVersion === "7.4.33", "reported version is retained");
assert(unsafe.php.support === "unsupported", "PHP 7.4 unsupported");
assert(unsafe.php.indicators.includes("session-cookie"), "PHP session indicator");
assert(unsafe.cookies.sessionMissingSecure === 1, "session Secure gap");
assert(unsafe.cookies.sessionMissingHttpOnly === 1, "session HttpOnly gap");
assert(unsafe.findings.some((item) => item.id === "php-unsupported" && item.severity === "attention"), "unsupported PHP warning");
assert(unsafe.findings.some((item) => item.id === "missing-csp" && item.severity === "improvement"), "CSP hardening not vulnerability");
assert(!JSON.stringify(unsafe).includes("sensitive-secret-value"), "secret cookie values never exposed");
assert(!JSON.stringify(unsafe).includes("another-private-value"), "analytics cookie values never exposed");

const protectedSite = assessPublicWebSecurity(
  makeHeaders({
    "X-Powered-By": "PHP/8.4.3",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none'",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  }, ["session=private-value; Secure; HttpOnly; SameSite=Lax; Path=/"]),
  new URL("https://example.net"),
  200,
  true,
);
assert(protectedSite.php.support !== "unsupported", "supported PHP branch");
assert(protectedSite.findings.length === 0, "no findings in fully configured public response");
assert(protectedSite.cookies.sessionCookies === 1, "session cookie observed");
assert(protectedSite.headers.frameProtection, "frame-ancestors accepted");

const unknown = assessPublicWebSecurity(makeHeaders({}), new URL("https://example.org"), 403, false);
assert(unknown.limited === true, "blocked response yields limited coverage");
assert(unknown.findings.length === 0, "blocked response does not yield false missing header warnings");
assert(unknown.php.indicators.length === 0, "no PHP fingerprint is not PHP absence");
console.log("VONU_WEB_SECURITY_CONTRACT_GREEN passive=1 php=1 cookies=1 headers=1 privacy=1 limited=1");
