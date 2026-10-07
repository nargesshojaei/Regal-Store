import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const css = `
@import "tailwindcss";
@theme {
  --color-white: #ffffff;
  --color-black: #0b0c17;
}
@layer utilities {
  .probe { @apply bg-white text-black; }
}
`;

const result = await postcss([tailwind()]).process(css, { from: "probe.css" });
const out = result.css;
const i = out.indexOf(".probe");
console.log("--- probe ---");
console.log(out.slice(i, i + 300));
const marker = "@layer theme";
const j = out.indexOf(marker);
console.log("--- layer ---");
console.log(out.slice(j, j + 400));
