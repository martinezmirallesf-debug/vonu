// Guard new public tables against missing Data API access decisions.
import { readFileSync } from "node:fs";

function verify(source, file) {
  const sql = source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\n]*/g, " ");
  const create = /\bcreate\s+(?:unlogged\s+)?table\s+(?:if\s+not\s+exists\s+)?(?:(?:"?public"?)\s*\.\s*)?("?([a-z_][a-z0-9_]*)"?)(?=\s*[(]|\s+as\b)/gi;
  const grants = sql.match(/\bgrant\b[^;]*;/gi) ?? [];
  const errors = [];
  for (const match of sql.matchAll(create)) {
    const name = match[2].toLowerCase();
    const table = "public." + name;
    const ref = '(?:public\\s*\\.\\s*)?"?' + name + '"?';
    if (new RegExp('\\bdrop\\s+table\\s+(?:if\\s+exists\\s+)?' + ref + '\\b', "i").test(sql)) continue;
    const rls = new RegExp('\\balter\\s+table\\s+(?:if\\s+exists\\s+)?' + ref + '\\s+enable\\s+row\\s+level\\s+security\\b', "i").test(sql);
    const internal = new RegExp('--\\s*data-api:\\s*private\\s+public\\.' + name + '\\b', "i").test(source);
    const grant = grants.some(stmt => new RegExp('\\bon\\s+(?:table\\s+)?public\\s*\\.\\s*"?'+name+'"?\\s+to\\s+(?:anon|authenticated|service_role)\\b', "i").test(stmt));
    if (!rls) errors.push(file + ": " + table + " must ENABLE ROW LEVEL SECURITY");
    if (!grant && !internal) errors.push(file + ": " + table + " requires explicit GRANT or -- data-api: private " + table);
  }
  return errors;
}
if (process.argv.includes("--self-test")) {
  const start = "CREATE TABLE public.example (id bigint); ALTER TABLE public.example ENABLE ROW LEVEL SECURITY; ";
  const cases = [
    [start + "GRANT SELECT ON TABLE public.example TO service_role;", 0],
    [start, 1],
    ["CREATE TABLE public.test_temp (id int); DROP TABLE public.test_temp;", 0],
    ["-- data-api: private public.example\n" + start, 0],
    ["CREATE TABLE public.example (id int); GRANT SELECT ON TABLE public.example TO anon;", 1],
  ];
  for (const [source, expected] of cases) {
    if (verify(source, "selftest").length !== expected) throw Error("SQL grant lint self-test failed");
  }
  console.log("SQL grant lint self-test passed.");
} else {
  const files = process.argv.slice(2);
  const errors = files.flatMap(file => verify(readFileSync(file,"utf8"), file));
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Supabase migration grants verified (" + files.length + " files).");
  }
}
