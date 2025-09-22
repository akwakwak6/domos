import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { configService } from "../services/config.service";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import fs from "fs";

if (!fs.existsSync(configService.dbRootPath)) {
    fs.mkdirSync(configService.dbRootPath, { recursive: true });
}
const sqlite = new Database(configService.dbPath);

const db = drizzle(sqlite);

migrate(db, { migrationsFolder: configService.migrationPath });

export const dbService = db;
