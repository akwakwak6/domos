import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as sqlite from "drizzle-orm/sqlite-core";
import { DeviceType } from "home-assistant-device-sdk";

export const deviceTypesTable = sqlite.sqliteTable("device_types", {
    type: sqlite.text("type").$type<DeviceType>().primaryKey(),
    isUsed: sqlite.int("is_used", { mode: "boolean" }).notNull().default(true),
});

export type DeviceTypeEntity = InferSelectModel<typeof deviceTypesTable>;
export type NewDeviceType = InferInsertModel<typeof deviceTypesTable>;
