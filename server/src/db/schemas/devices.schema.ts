import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as sqlite from "drizzle-orm/sqlite-core";
import { deviceTypesTable } from "./types.schema";
import { DeviceType } from "home-assistant-device-sdk";

export const devicesTable = sqlite.sqliteTable("devices", {
    id: sqlite.text("id").primaryKey(),
    name: sqlite.text("name").notNull(),
    type: sqlite
        .text("type")
        .$type<DeviceType>()
        .references(() => deviceTypesTable.type)
        .notNull(),
    wasDetected: sqlite.int("was_detected", { mode: "boolean" }).notNull(),
    isUsed: sqlite.int("is_used", { mode: "boolean" }).notNull().default(true),
});

export type DeviceEntity = InferSelectModel<typeof devicesTable>;
export type Newdevice = InferInsertModel<typeof devicesTable>;
