import { StatusCodes, ErrorDto, RunnerStateDto, runnerStateDtoSchema } from "@shared";
import { validateData } from "../middlewares/bodyValidation.middleware";
import { runnerService } from "../services/runner.service";
import { Request, Response } from "express";
import express from "express";

class RunnerCtrl {
    async publish(req: Request, res: Response<ErrorDto>) {
        try {
            await runnerService.publish();
            return res.status(StatusCodes.NO_CONTENT).json();
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to publish", details: error?.message ?? String(error) });
        }
    }

    async sync(req: Request, res: Response<ErrorDto>) {
        try {
            await runnerService.sync();
            return res.status(StatusCodes.NO_CONTENT).json();
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to sync", details: error?.message ?? String(error) });
        }
    }

    async getState(req: Request, res: Response<RunnerStateDto | ErrorDto>) {
        try {
            const state = await runnerService.getState();
            return res.status(StatusCodes.OK).json({ state });
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to getState", details: error?.message ?? String(error) });
        }
    }

    async setState(req: Request<{}, {}, RunnerStateDto>, res: Response<ErrorDto>) {
        try {
            const state = req.body;
            await runnerService.setState(state.state);
            return res.status(StatusCodes.NO_CONTENT).json();
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to setState", details: error?.message ?? String(error) });
        }
    }
}

export const runnerController = new RunnerCtrl();

const router = express.Router();

router.get("/publish", runnerController.publish);
router.get("/sync", runnerController.sync);
router.get("/state", runnerController.getState);
router.post("/state", validateData(runnerStateDtoSchema), runnerController.setState);

export const runnerRouter = router;
