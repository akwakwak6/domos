import { z } from "zod";

//TODO use DeviceType

export const deviceTypeDtoSchema = z.object({
    type: z.enum(["switch", "light"]),
    isUsed: z.boolean(),
});

export type DeviceTypeDto = z.infer<typeof deviceTypeDtoSchema>;
