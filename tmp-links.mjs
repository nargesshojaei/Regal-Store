import { writeFileSync } from "node:fs";

const res = await fetch("http://localhost:3000/");
const html = await res.text();
writeFileSync("tmp-home.html", html);
const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
console.log([...new Set(hrefs)].join("\n"));

const shop = await fetch("http://localhost:3000/shop");
const shopHtml = await shop.text();
writeFileSync("tmp-shop.html", shopHtml);
const shopHrefs = [...shopHtml.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
console.log("--- shop ---");
console.log([...new Set(shopHrefs)].filter((h) => h.includes("shop")).join("\n"));
