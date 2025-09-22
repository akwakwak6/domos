import path from "path";

class ConfigService {
    public readonly dbPath: string;
    public readonly migrationPath: string;
    public readonly dbRootPath: string;
    public readonly runnerRootPath: string;
    public readonly haFilePath: string;
    public readonly runnerStartFilePath: string = "dist/runner.js";
    public readonly runnerBuildCmd: string = "node esbuild.config.mjs";

    constructor() {
        const isProduction = process.env.NODE_ENV === "production";

        const dbFolder = isProduction ? "workdir" : "src";
        this.dbRootPath = path.resolve(process.cwd(), dbFolder, "db");
        this.dbPath = path.resolve(this.dbRootPath, "db.sqlite");

        const runnerPath = isProduction ? "workdir" : "..";
        this.runnerRootPath = path.resolve(process.cwd(), runnerPath, "runner");
        this.haFilePath = path.resolve(this.runnerRootPath, "ha.ts");

        if (isProduction) {
            this.migrationPath = path.resolve(process.cwd(), "dist", "server", "DBmigrations");
        } else {
            this.migrationPath = path.resolve(process.cwd(), "src", "db", "migrations");
        }
    }
}

export const configService = new ConfigService();
