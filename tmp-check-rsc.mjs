async function hit(path, headers) {
  const r = await fetch("http://localhost:3000" + path, { headers });
  const t = await r.text();
  const notFound = t.includes("This page could not be found") || t.includes("/_not-found");
  const product = t.includes("پیراهن") || t.includes("محصولات");
  console.log(path, JSON.stringify(headers), r.status, "notFoundHint", notFound, "productHint", product, "len", t.length);
}

await hit("/shop/1", { RSC: "1" });
await hit("/shop/1", { RSC: "1", "Next-Router-Prefetch": "1" });
await hit("/shop", { RSC: "1" });
await hit("/shop/discount", { RSC: "1", "Next-Router-Prefetch": "1" });
