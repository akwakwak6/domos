import { CredentialsDto, credentialsDtoSchema, ErrorDto, StatusCodes } from "@shared";
import { validateData } from "../middlewares/bodyValidation.middleware";
import { credentialsService } from "../services/credentials.service";
import { Request, Response } from "express";
import express from "express";

class ConfigCtrl {
    async saveCredentials(req: Request<{}, {}, CredentialsDto>, res: Response<ErrorDto>) {
        try {
            const { url, token } = req.body;

            const formatedUrl = url.endsWith("/") ? url : url + "/";

            await credentialsService.saveCredentials(formatedUrl, token);

            return res.status(StatusCodes.NO_CONTENT).json();
        } catch (error: any) {
            if (error instanceof Error) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "Failed to save credentials", details: error?.message ?? String(error) });
            }

            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to save credentials", details: error?.message ?? String(error) });
        }
    }

    async getCredentials(req: Request, res: Response<ErrorDto | CredentialsDto | null>) {
        try {
            const credentials = await credentialsService.getCredentials();
            return res.status(StatusCodes.OK).json(credentials);
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to get credentials", details: error?.message ?? String(error) });
        }
    }
}

export const configController = new ConfigCtrl();

const router = express.Router();

router.get("/credentials", configController.getCredentials);
router.post("/credentials", validateData(credentialsDtoSchema), configController.saveCredentials);

export const configRouter = router;
