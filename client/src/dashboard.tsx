import {
    onCredentialsChange,
    iframeUrl,
    runnerPublish,
    runnerSync,
    setSettingsTab,
    SettingsTab,
} from "./services/settings.service";
import { SettingFrame } from "./settingTabs/settingFrame";
import styles from "./dashboard.module.scss";
import { useEffect, useState } from "react";

enum Onglet {
    CODE,
    SETTING,
}

const IFRAME_CODE = <iframe className={styles.iframeCode} src={iframeUrl}></iframe>;

export default function Dashboard() {
    const [onglet, setOnglet] = useState(Onglet.CODE);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [contant, setContant] = useState(IFRAME_CODE);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);

    useEffect(() => {
        return onCredentialsChange((creds) => {
            setIsConnected(!!creds);
        });
    }, []);

    const changeOnglet = () => {
        if (onglet === Onglet.CODE) {
            setOnglet(Onglet.SETTING);
            setContant(<SettingFrame />);
        } else {
            setOnglet(Onglet.CODE);
            setContant(IFRAME_CODE);
        }
    };

    const handlePublish = async () => {
        setPublishError(null);
        setIsPublishing(true);
        const ok = await runnerPublish();
        setIsPublishing(false);
        if (!ok) setPublishError("Failed to publish");
    };

    const handleSync = async () => {
        setPublishError(null);
        setIsSyncing(true);
        const ok = await runnerSync();
        setIsSyncing(false);
        if (!ok) setPublishError("Failed to sync");
    };

    const goToCredentials = () => {
        setSettingsTab(SettingsTab.CREDENTIALS);
        setOnglet(Onglet.SETTING);
        setContant(<SettingFrame />);
    };

    const publishButton = (
        <button className={styles.publishButton} onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? (
                <>
                    <span className={styles.spinner}></span>
                    Publishing...
                </>
            ) : (
                "Publish"
            )}
        </button>
    );

    const syncButton = (
        <button className={styles.publishButton} onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? (
                <>
                    <span className={styles.spinner}></span>
                    Syncing...
                </>
            ) : (
                "Sync"
            )}
        </button>
    );

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.headerLeftNameContainer}>
                    <h1 className={styles.headerLeftName}>LogicFlow</h1>
                </div>
                <div className={styles.flexSpacer}></div>

                <div className={styles.buttonsContainer}>
                    {isConnected ? (
                        <>
                            {publishError && <span className={styles.publishErrorMessage}>{publishError}</span>}
                            {onglet === Onglet.CODE ? publishButton : syncButton}
                        </>
                    ) : (
                        <>
                            <span className={styles.ErrorMessageNotConnected}>Not Connected</span>
                            <button className={styles.publishButton} onClick={goToCredentials}>
                                set home assistant credentials
                            </button>
                        </>
                    )}

                    <button className={styles.settingCodeButton} onClick={changeOnglet}>
                        {onglet === Onglet.CODE ? "Settings" : "Code"}
                    </button>
                </div>
            </header>
            {contant}
        </div>
    );
}
