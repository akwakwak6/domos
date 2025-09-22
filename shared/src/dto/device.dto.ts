import { DeviceType } from "home-assistant-device-sdk";
import { z } from "zod";

export interface DeviceDto {
    id: string;
    name: string;
    type: DeviceType;
    wasDetected: boolean;
    isUsed: boolean;
}

export const updateDevicesDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    isUsed: z.boolean(),
});

export const updateDeviceArrayDtoSchema = z.array(updateDevicesDtoSchema);

export type UpdateDeviceDto = z.infer<typeof updateDevicesDtoSchema>;
export type UpdateDeviceArrayDto = z.infer<typeof updateDeviceArrayDtoSchema>;
