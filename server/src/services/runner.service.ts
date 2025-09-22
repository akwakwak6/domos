import { buildHaFile, IBuilderHaOption } from "home-assistant-device-sdk";
import { configRepo } from "../repositories/config.repositorie";
import { haSdkConfigDalService } from "./haSdkConfigDal.service";
import { ChildProcessWithoutNullStreams, exec, spawn } from "child_process";
import { configService } from "./config.service";
import { dashboardRepo } from "../repositories/dashboard.repositorie";
import { RunnerLogType } from "@shared";
import { promisify } from "util";

const execPromise = promisify(exec);

class RunnerService {
    private process: ChildProcessWithoutNullStreams | null = null;
    private tryToRestart = true;

    constructor() {
        this.startService();
    }

    async sync() {
        const credentials = await configRepo.getCredentials();
        if (!credentials) {
            throw Error("credentials not found");
        }
        const config: IBuilderHaOption = {
            url: credentials.url,
            token: credentials.token,
            out: configService.haFilePath,
            configDal: haSdkConfigDalService,
        };
        await buildHaFile(config);
    }

    async publish() {
        await dashboardRepo.deleteLogs();

        try {
            await execPromise(configService.runnerBuildCmd, {
                cwd: configService.runnerRootPath,
            });
        } catch (error: any) {
            dashboardRepo.saveLog("❌ Build failed", RunnerLogType.ERROR);
            if (error.stdout) {
                dashboardRepo.saveLog(error.stdout);
            }
            if (error.stderr) {
                dashboardRepo.saveLog(error.stderr, RunnerLogType.ERROR);
            }
            throw error;
        }
        this.start();
    }

    getState() {
        return this.process !== null;
    }

    async setState(state: boolean) {
        if (this.process && state) {
            dashboardRepo.saveLog("Restarting runner by user", RunnerLogType.INFO);
            await this.stop();
            return;
        }
        if (state) {
            dashboardRepo.saveLog("Starting runner by user", RunnerLogType.INFO);
            this.start();
            return;
        }
        dashboardRepo.saveLog("Stopping runner by user", RunnerLogType.INFO);
        await this.stop();
    }

    private async startService() {
        const isRunnerEnabled = await configRepo.isRunnerEnabled();
        if (isRunnerEnabled) {
            await this.start();
        }
    }

    private async start() {
        dashboardRepo.saveLog("Starting runner", RunnerLogType.INFO);
        const credentials = await configRepo.getCredentials();
        if (!credentials) {
            throw Error("credentials not found");
        }
        this.process = spawn("node", [configService.runnerStartFilePath, credentials.url, credentials.token], {
            cwd: configService.runnerRootPath,
        });
        this.process.stdout.on("data", (data) => {
            dashboardRepo.saveLog(data.toString());
        });
        this.process.stderr.on("data", (data) => dashboardRepo.saveLog(data.toString(), RunnerLogType.ERROR));
        configRepo.setRunnerEnabled(true);
        this.process.on("close", async () => {
            dashboardRepo.saveLog("Runner closed", RunnerLogType.INFO);
            await this.stop();
            if (this.tryToRestart) {
                this.start();
            } else {
                dashboardRepo.saveLog("Runner skip try to restart", RunnerLogType.WARN);
                this.tryToRestart = true;
            }
        });
        this.process.on("error", (error) => {
            dashboardRepo.saveLog(error.message, RunnerLogType.ERROR);
        });
        this.tryToRestart = false;
        setTimeout(() => {
            this.tryToRestart = true;
        }, 10_000);
    }

    private async stop() {
        this.tryToRestart = false;
        this.process?.kill();
        this.process = null;
        await configRepo.setRunnerEnabled(false);
    }
}

export const runnerService = new RunnerService();
