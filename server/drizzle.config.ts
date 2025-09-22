import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/db/schemas/index.ts",
    out: "./src/db/migrations",
    dbCredentials: {
        url: "src/db/db.sqlite",
    },
});
