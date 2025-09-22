import { DeviceTypeEntity, deviceTypesTable, RunnerLogEntity, runnerLogTable } from "../db/schemas";
import { DeviceTypeDto } from "@shared/src/dto/deviceType.dto";
import { UpdateDeviceDto } from "@shared/src/dto/device.dto";
import { DeviceEntity, devicesTable } from "../db/schemas";
import { eq, desc } from "drizzle-orm";
import { dbService } from "../services/sqlite.service";
import { RunnerLogType } from "@shared";

class DashboardRepository {
    constructor() {
        this.initDeviceTypes();
    }

    async getAllDevices(): Promise<DeviceEntity[]> {
        return await dbService.select().from(devicesTable);
    }

    updateDevices(deviceDto: UpdateDeviceDto[]): void {
        dbService.transaction((tx) => {
            for (const device of deviceDto) {
                tx.update(devicesTable)
                    .set({
                        name: device.name,
                        isUsed: device.isUsed,
                    })
                    .where(eq(devicesTable.id, device.id))
                    .run();
            }
        });
    }

    async setDevices(newDevices: DeviceEntity[]): Promise<void> {
        await dbService.delete(devicesTable);
        await dbService.insert(devicesTable).values(newDevices);
    }

    async deleteAllDevices(): Promise<void> {
        await dbService.delete(devicesTable);
    }

    async getDeviceTypes(): Promise<DeviceTypeEntity[]> {
        return await dbService.select().from(deviceTypesTable);
    }

    async updateDeviceType(deviceTypeDto: DeviceTypeDto): Promise<void> {
        await dbService
            .update(deviceTypesTable)
            .set({ isUsed: deviceTypeDto.isUsed })
            .where(eq(deviceTypesTable.type, deviceTypeDto.type));
    }

    async getRunnerLogs(): Promise<RunnerLogEntity[]> {
        return await dbService.select().from(runnerLogTable).orderBy(desc(runnerLogTable.date)).limit(20);
    }

    async saveLog(message: string, type?: RunnerLogType) {
        await dbService.insert(runnerLogTable).values({ message, type });
    }

    async deleteLogs() {
        await dbService.delete(runnerLogTable);
    }

    private async initDeviceTypes() {
        await dbService
            .insert(deviceTypesTable)
            .values([{ type: "switch" }, { type: "light" }])
            .onConflictDoNothing({ target: deviceTypesTable.type });
    }
}

export const dashboardRepo = new DashboardRepository();
