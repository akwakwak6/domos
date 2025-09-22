import { fileURLToPath } from "node:url";
import { cp, stat } from "node:fs/promises";
import { build } from "esbuild";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sharedAliasPlugin = {
    name: "alias-shared",
    setup(build) {
        const SHARED_PREFIX = "@shared";
        const SHARED_DIR = path.resolve(__dirname, "../shared");
        const filter = /^@shared(\/.*)?$/;
        build.onResolve({ filter }, (args) => {
            const suffix = args.path === SHARED_PREFIX ? "/index.ts" : args.path.slice(SHARED_PREFIX.length);
            const resolved = path.join(SHARED_DIR, suffix);
            return { path: resolved };
        });
    },
};

// await cp("../node_modules/better-sqlite3/build/Release/better_sqlite3.node", "../dist/server/better_sqlite3.node");

// Copy migrations only if they exist (optional in some setups)
try {
    await stat("src/db/migrations");
    await cp("src/db/migrations", "../dist/server/DBmigrations", { recursive: true });
} catch {
    // No migrations directory; skip copy
}

await build({
    entryPoints: [path.resolve(__dirname, "src/index.ts")],
    outfile: path.resolve(__dirname, "../dist/server/index.cjs"),
    bundle: true,
    minify: true,
    platform: "node",
    format: "cjs",
    target: ["node24"],
    sourcemap: false,
    treeShaking: true,
    plugins: [sharedAliasPlugin],
    external: ["better-sqlite3"],
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
});
