import {
    DeviceDto,
    UpdateDeviceDto,
    updateDeviceArrayDtoSchema,
    ErrorDto,
    StatusCodes,
    DeviceTypeDto,
    deviceTypeDtoSchema,
    RunnerLogDto,
} from "@shared";
import { validateData } from "../middlewares/bodyValidation.middleware";
import { dashboardRepo } from "../repositories/dashboard.repositorie";
import { runnerService } from "../services/runner.service";
import { Request, Response } from "express";
import express from "express";

class DashboardCtrl {
    async getDevices(req: Request, res: Response<DeviceDto[] | ErrorDto>) {
        try {
            const devices = await dashboardRepo.getAllDevices();
            return res.status(200).json(devices);
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to get devices", details: error?.message ?? String(error) });
        }
    }

    async updateDevices(req: Request<{}, {}, UpdateDeviceDto[]>, res: Response<ErrorDto>) {
        try {
            const devices = req.body;
            dashboardRepo.updateDevices(devices);
            return res.status(200).json();
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to update devices", details: error?.message ?? String(error) });
        }
    }

    async getDeviceTypes(req: Request, res: Response<DeviceTypeDto[] | ErrorDto>) {
        try {
            const deviceTypes = await dashboardRepo.getDeviceTypes();
            return res.status(200).json(deviceTypes);
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to get device types", details: error?.message ?? String(error) });
        }
    }

    async updateDeviceType(req: Request<{}, {}, DeviceTypeDto>, res: Response<ErrorDto>) {
        try {
            const deviceType = req.body;
            await dashboardRepo.updateDeviceType(deviceType);
            return res.status(200).json();
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to update device type", details: error?.message ?? String(error) });
        }
    }

    async getRunnerLogs(req: Request, res: Response<RunnerLogDto[] | ErrorDto>) {
        try {
            const runnerLogs = await dashboardRepo.getRunnerLogs();
            return res.status(200).json(runnerLogs);
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to get runner logs", details: error?.message ?? String(error) });
        }
    }

    async deleteRunnerLogs(req: Request, res: Response<ErrorDto>) {
        try {
            await dashboardRepo.deleteLogs();
            return res.status(StatusCodes.NO_CONTENT).json();
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to delete runner logs", details: error?.message ?? String(error) });
        }
    }

    async deleteAllDevicesAndSync(req: Request, res: Response<ErrorDto>) {
        try {
            await dashboardRepo.deleteAllDevices();
            await runnerService.sync();
            return res.status(StatusCodes.NO_CONTENT).json();
        } catch (error: any) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: "Failed to delete all devices and sync", details: error?.message ?? String(error) });
        }
    }
}

export const dashboardController = new DashboardCtrl();

const router = express.Router();

router.post("/devices", validateData(updateDeviceArrayDtoSchema), dashboardController.updateDevices);
router.get("/devices", dashboardController.getDevices);
router.delete("/devices/delete-all-sync", dashboardController.deleteAllDevicesAndSync);

router.post("/types", validateData(deviceTypeDtoSchema), dashboardController.updateDeviceType);
router.get("/types", dashboardController.getDeviceTypes);

router.get("/logs", dashboardController.getRunnerLogs);
router.delete("/logs", dashboardController.deleteRunnerLogs);

export const dashboardRouter = router;
