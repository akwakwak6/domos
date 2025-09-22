import { IConfig, IConfigDal, IConfigDevice } from "home-assistant-device-sdk";
import { dashboardRepo } from "../repositories/dashboard.repositorie";
import { configRepo } from "../repositories/config.repositorie";

class HaSdkConfigDalService implements IConfigDal {
    async getAllConfig(): Promise<Partial<IConfig>> {
        const config: Partial<IConfig> = {};

        const storedCredentials = await configRepo.getCredentials();
        if (storedCredentials) {
            config.credentials = {
                url: storedCredentials.url,
                token: storedCredentials.token,
            };
        }

        const storedDevices = await dashboardRepo.getAllDevices();
        if (storedDevices) {
            config.devices = storedDevices.reduce((acc, device) => {
                acc[device.id] = {
                    name: device.name,
                    type: device.type,
                    wasDetected: device.wasDetected,
                    isUsed: device.isUsed,
                };
                return acc;
            }, {} as { [ID: string]: IConfigDevice });
        }

        const storedDeviceTypes = await dashboardRepo.getDeviceTypes();
        if (storedDeviceTypes) {
            config.deviceType = storedDeviceTypes.reduce((acc, deviceType) => {
                acc[deviceType.type] = deviceType.isUsed;
                return acc;
            }, {} as { [type: string]: boolean });
        }

        return config;
    }

    setDevices(devices: { [ID: string]: IConfigDevice }): Promise<void> {
        const devicesArray = Object.entries(devices).map(([id, dev]) => ({
            id,
            name: dev.name,
            type: dev.type,
            wasDetected: dev.wasDetected,
            isUsed: dev.isUsed ?? true,
        }));
        return dashboardRepo.setDevices(devicesArray);
    }
}

export const haSdkConfigDalService = new HaSdkConfigDalService();
