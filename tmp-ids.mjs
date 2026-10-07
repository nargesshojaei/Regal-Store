const ids = [47, 35, 28, 17, 64, 63, 56, 1];

for (const id of ids) {
  const api = await fetch("http://localhost:3002/products/" + id);
  const page = await fetch("http://localhost:3000/shop/" + id);
  const html = await page.text();
  const h1 = [...html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/g)].map((m) => m[1].trim());
  console.log("id", id, "api", api.status, "page", page.status, "h1", h1.join(" | "));
}
