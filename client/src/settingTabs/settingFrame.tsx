import { getSettingsTab, onSettingsTabChange, setSettingsTab, SettingsTab } from "../services/settings.service";
import { CredentialsSetting } from "./credentials";
import DeviceTypesTab from "./deviceTypesTab";
import { DevicesTab } from "./devicesTab";
import RunnerLogsTab from "./logsTab";
import styles from "./settings.module.scss";
import { useEffect, useState } from "react";

export interface SettingFrameProps {
    activeTab?: SettingsTab;
}

export function SettingFrame(props: SettingFrameProps) {
    const [internalTab, setInternalTab] = useState(props.activeTab ?? getSettingsTab());
    const setActiveTab = (tab: SettingsTab) => {
        setInternalTab(tab);
        setSettingsTab(tab);
    };

    useEffect(() => {
        return onSettingsTabChange(setActiveTab);
    }, []);

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.tabNavigation}>
                <button
                    className={`${styles.tabButton} ${internalTab === SettingsTab.DEVICES ? styles.active : ""}`}
                    onClick={() => setActiveTab(SettingsTab.DEVICES)}
                >
                    Devices
                </button>
                <button
                    className={`${styles.tabButton} ${internalTab === SettingsTab.DEVICE_TYPES ? styles.active : ""}`}
                    onClick={() => setActiveTab(SettingsTab.DEVICE_TYPES)}
                >
                    Types
                </button>
                <button
                    className={`${styles.tabButton} ${internalTab === SettingsTab.CREDENTIALS ? styles.active : ""}`}
                    onClick={() => setActiveTab(SettingsTab.CREDENTIALS)}
                >
                    Credentials
                </button>
                <button
                    className={`${styles.tabButton} ${internalTab === SettingsTab.RUNNER_LOGS ? styles.active : ""}`}
                    onClick={() => setActiveTab(SettingsTab.RUNNER_LOGS)}
                >
                    Runner Logs
                </button>
            </div>

            <div className={styles.tabContent}>
                {internalTab === SettingsTab.DEVICES && <DevicesTab />}
                {internalTab === SettingsTab.DEVICE_TYPES && <DeviceTypesTab />}
                {internalTab === SettingsTab.CREDENTIALS && <CredentialsSetting />}
                {internalTab === SettingsTab.RUNNER_LOGS && <RunnerLogsTab />}
            </div>
        </div>
    );
}
