async function go(path) {
  const r = await fetch("http://localhost:3000" + path, { redirect: "manual" });
  const t = await r.text();
  const titles = [...t.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => m[1]);
  const h1 = [...t.matchAll(/<h1[^>]*>([^<]*)<\/h1>/g)].map((m) => m[1]);
  console.log(path, r.status, "titles", titles.join(" || "), "h1", h1.join(" || "));
}

const home = await (await fetch("http://localhost:3000/")).text();
const hrefs = [...home.matchAll(/href=\\"(\/[^\\"]+)\\"/g)].map((m) => m[1]);
const uniq = [...new Set(hrefs)].filter(
  (h) => h.includes("shop") || h.includes("product"),
);
console.log("home links", uniq.slice(0, 50));

await go("/products");
await go("/product/1");
await go("/shop/2");
await go("/shop/1");
