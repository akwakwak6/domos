import { build } from "esbuild";

await build({
    entryPoints: ["index.ts"],
    outfile: "dist/runner.js",
    bundle: true,
    minify: false,
    platform: "node",
    target: ["node24"],
    format: "esm",
    sourcemap: true,
    treeShaking: false,
});
