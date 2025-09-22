import { configRouter } from "./controllers/config";
import { dashboardRouter } from "./controllers/dashboard.ctrl";
import { runnerRouter } from "./controllers/runner.ctrl";
import type { Request, Response } from "express";
import express from "express";
import cors from "cors";
import os from "os";

const app = express();
app.use(cors());
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
let address = Object.values(os.networkInterfaces())
    .flat()
    .find((ip) => ip?.family === "IPv4" && !ip.internal)?.address;

app.use(express.json());

const router = express.Router();
router.use("/config", configRouter);
router.use("/dashboard", dashboardRouter);
router.use("/runner", runnerRouter);

app.use("/", router);

app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

app.listen(port, () => {
    console.log(`Server listening on http://${address}:${port}`);
});
