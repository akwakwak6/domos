import { DeviceTypeDto, CredentialsDto, DeviceDto, RunnerLogDto, RunnerStateDto, UpdateDeviceDto } from "@shared";

const isProd = import.meta.env.VITE_NODE_ENV === "production";

const BASE_URL = isProd ? "/api/" : "http://localhost:3000/";

const URL_DEVICES = BASE_URL + "dashboard/devices";
const URL_DEVICE_TYPES = BASE_URL + "dashboard/types";
const URL_LOGS = BASE_URL + "dashboard/logs";
const URL_DEVICES_DELETE_ALL_SYNC = BASE_URL + "dashboard/devices/delete-all-sync";
const URL_CREDENTIALS = BASE_URL + "config/credentials";
const URL_RUNNER_PUBLISH = BASE_URL + "runner/publish";
const URL_RUNNER_SYNC = BASE_URL + "runner/sync";
const URL_RUNNER_STATE = BASE_URL + "runner/state";

export enum SettingsTab {
    DEVICES,
    DEVICE_TYPES,
    CREDENTIALS,
    RUNNER_LOGS,
}

let settingsTab: SettingsTab = SettingsTab.DEVICES;

export function getSettingsTab(): SettingsTab {
    return settingsTab;
}

const onSettingsTabChangeListeners = new Set<(tab: SettingsTab) => void>();

export function onSettingsTabChange(onChange: (tab: SettingsTab) => void): () => void {
    onSettingsTabChangeListeners.add(onChange);
    return () => {
        onSettingsTabChangeListeners.delete(onChange);
    };
}

export function setSettingsTab(tab: SettingsTab): void {
    if (settingsTab === tab) {
        return;
    }
    settingsTab = tab;
    onSettingsTabChangeListeners.forEach((listener) => listener(tab));
}

export const iframeUrl = isProd ? "/code/" : "/code-fallback.html";

async function sendFetch<T>(
    url: string,
    method: "GET" | "POST",
    body?: any
): Promise<{ ok: boolean; data: T | null; status: number }> {
    const request: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (body !== undefined) {
        request.body = JSON.stringify(body);
    }

    const response = await fetch(url, request);

    if (response.status === 204) {
        return { ok: true, data: null, status: response.status };
    }

    if (response.ok) {
        try {
            const json = (await response.json()) as T;
            return { ok: true, data: json, status: response.status };
        } catch {
            return { ok: true, data: null, status: response.status };
        }
    }

    return { ok: false, data: null, status: response.status };
}

async function sendGet<T>(url: string): Promise<{ ok: boolean; data: T | null; status: number }> {
    return sendFetch<T>(url, "GET");
}

async function sendPost<T>(url: string, body: any): Promise<{ ok: boolean; data: T | null; status: number }> {
    return sendFetch<T>(url, "POST", body);
}

export async function getDevices(): Promise<DeviceDto[] | null> {
    const res = await sendGet<DeviceDto[]>(URL_DEVICES);
    return res.ok ? res.data : null;
}

export async function updateDevices(devices: UpdateDeviceDto[]): Promise<boolean> {
    const res = await sendPost<void>(URL_DEVICES, devices);
    return res.ok;
}

export async function getDeviceTypes(): Promise<DeviceTypeDto[] | null> {
    const res = await sendGet<DeviceTypeDto[]>(URL_DEVICE_TYPES);
    return res.ok ? res.data : null;
}

export async function updateDeviceType(deviceType: DeviceTypeDto): Promise<boolean> {
    const res = await sendPost<void>(URL_DEVICE_TYPES, deviceType);
    return res.ok;
}

export async function getRunnerLogs(): Promise<RunnerLogDto[] | null> {
    const res = await sendGet<RunnerLogDto[]>(URL_LOGS);
    return res.ok ? res.data : null;
}

export async function deleteAllLogs(): Promise<boolean> {
    const response = await fetch(URL_LOGS, { method: "DELETE" });
    return response.ok;
}

export async function deleteAllDevicesAndSync(): Promise<boolean> {
    const response = await fetch(URL_DEVICES_DELETE_ALL_SYNC, { method: "DELETE" });
    return response.ok;
}

let credentials: CredentialsDto | null = null;
const onCredentialsChangeListeners = new Set<(credentials: CredentialsDto | null) => void>();

async function getCredentials(): Promise<void> {
    if (credentials === null) {
        const res = await sendGet<CredentialsDto | null>(URL_CREDENTIALS);
        credentials = res.ok ? res.data ?? null : null;
    }
    onCredentialsChangeListeners.forEach((listener) => listener(credentials));
}

export function onCredentialsChange(onChange: (credentials: CredentialsDto | null) => void): () => void {
    onCredentialsChangeListeners.add(onChange);
    getCredentials();
    return () => {
        onCredentialsChangeListeners.delete(onChange);
    };
}

export async function saveCredentials(credentials: CredentialsDto): Promise<boolean> {
    const res = await sendPost<void>(URL_CREDENTIALS, credentials);
    if (res.ok) {
        getCredentials();
    }
    return res.ok;
}

export async function runnerPublish(): Promise<boolean> {
    const res = await sendGet<void>(URL_RUNNER_PUBLISH);
    return res.ok;
}

export async function runnerSync(): Promise<boolean> {
    const res = await sendGet<void>(URL_RUNNER_SYNC);
    return res.ok;
}

export async function getRunnerState(): Promise<RunnerStateDto | null> {
    const res = await sendGet<RunnerStateDto>(URL_RUNNER_STATE);
    return res.ok ? res.data : null;
}

export async function setRunnerState(state: RunnerStateDto): Promise<boolean> {
    const res = await sendPost<void>(URL_RUNNER_STATE, state);
    return res.ok;
}
