import type { NextConfig } from "next";
import path from "node:path";

const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Parent lockfile in D:\sharif made nested admin routes 404.
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
