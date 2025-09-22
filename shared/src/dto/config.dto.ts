import { z } from "zod";

export const credentialsDtoSchema = z.object({
    url: z.url(),
    token: z.string(),
});

export type CredentialsDto = z.infer<typeof credentialsDtoSchema>;

export const runnerStateDtoSchema = z.object({
    state: z.boolean(),
});

export type RunnerStateDto = z.infer<typeof runnerStateDtoSchema>;
