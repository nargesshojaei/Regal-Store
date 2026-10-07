const headers = {
  RSC: "1",
  "Next-Router-Prefetch": "1",
  "Next-Router-Segment-Prefetch": "/_full",
};
const r = await fetch("http://localhost:3000/shop/47", { headers });
console.log("status", r.status);
console.log(await r.text());
