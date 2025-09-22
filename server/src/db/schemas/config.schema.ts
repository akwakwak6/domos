import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const configTable = sqliteTable("config", {
    url: text("url").notNull(),
    token: text("token").notNull(),
    isConnected: int("is_connected", { mode: "boolean" }).notNull().default(false),
    isRunnerEnabled: int("is_runner_enabled", { mode: "boolean" }).notNull().default(false),
});

export type ConfigEntity = InferSelectModel<typeof configTable>;
export type NewConfig = InferInsertModel<typeof configTable>;
