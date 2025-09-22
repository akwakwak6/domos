import { CredentialsDto } from "@shared";
import { configTable } from "../db/schemas";
import { dbService } from "../services/sqlite.service";

class ConfigRepository {
    constructor() {
        this.initConfig();
    }

    async saveCredentials(url: string, token: string): Promise<void> {
        await dbService.delete(configTable);
        await dbService.insert(configTable).values({ url, token });
    }

    async getCredentials(): Promise<CredentialsDto | null> {
        const url = process.env.HA_URL;
        const token = process.env.HA_TOKEN;

        if (url && token) {
            return { url, token };
        }

        const rows = await dbService
            .select({ url: configTable.url, token: configTable.token })
            .from(configTable)
            .limit(1);

        if (rows[0]?.token && rows[0]?.url) {
            return {
                url: rows[0].url,
                token: rows[0].token,
            };
        }
        return null;
    }

    async isConnected(): Promise<boolean> {
        const rows = await dbService.select({ isConnected: configTable.isConnected }).from(configTable).limit(1);
        return rows[0]?.isConnected ?? false;
    }

    async setIsConnected(isConnected: boolean): Promise<void> {
        await dbService.update(configTable).set({ isConnected }).run();
    }

    async isRunnerEnabled(): Promise<boolean> {
        const rows = await dbService
            .select({ isRunnerEnabled: configTable.isRunnerEnabled })
            .from(configTable)
            .limit(1);
        return rows[0]?.isRunnerEnabled ?? false;
    }

    async setRunnerEnabled(isRunnerEnabled: boolean): Promise<void> {
        await dbService.update(configTable).set({ isRunnerEnabled }).run();
    }

    private async initConfig() {
        const rows = await dbService.select().from(configTable).limit(1);
        if (rows.length === 0) {
            await dbService.insert(configTable).values({ url: "", token: "" });
        }
    }
}

export const configRepo = new ConfigRepository();
