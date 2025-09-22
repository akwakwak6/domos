import { RunnerLogType } from "@shared";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as sqlite from "drizzle-orm/sqlite-core";

export const runnerLogTable = sqlite.sqliteTable("runnerLog", {
    date: sqlite
        .int("date", { mode: "timestamp" })
        .$defaultFn(() => new Date())
        .notNull(),
    message: sqlite.text("message").notNull(),
    type: sqlite.text("type").$type<RunnerLogType>().notNull().default(RunnerLogType.INFO),
});

export type RunnerLogEntity = InferSelectModel<typeof runnerLogTable>;
export type NewRunnerLog = InferInsertModel<typeof runnerLogTable>;
