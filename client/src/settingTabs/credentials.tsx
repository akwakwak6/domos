import { onCredentialsChange, saveCredentials } from "../services/settings.service";
import styles from "./credentials.module.scss";
import { useEffect, useState } from "react";

export function CredentialsSetting() {
    const [url, setUrl] = useState("");
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        return onCredentialsChange((creds) => {
            if (creds) {
                setUrl(creds.url);
                setToken(creds.token);
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url || !token) {
            setError("Please fill in all fields.");
            return;
        }

        if (!/^https?:\/\//.test(url)) {
            setError("Url must start with http:// or https://");
            return;
        }

        setIsLoading(true);

        const ok = await saveCredentials({ url, token });

        if (!ok) {
            setError("Failed to save credentials");
        } else {
            setError("");
            setShowSuccessModal(true);
        }

        setIsLoading(false);
    };

    return (
        <div className={`${styles.pageContainer}`}>
            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h4 className={styles.modalTitle}>Credentials saved</h4>
                        <p className={styles.modalText}>
                            Your Home Assistant URL and Access Token are valid and have been saved successfully.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.btnPrimary} onClick={() => setShowSuccessModal(false)}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.title}>Home Assistant Configuration</h2>
                </div>
                <form className={styles.formContainer} onSubmit={handleSubmit}>
                    <div>
                        <label className={styles.label}>Server URL *</label>
                        <input
                            value={url}
                            className={styles.input}
                            type="text"
                            placeholder="http://homeassistant:8123"
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={styles.label}>Long-Lived Access Token *</label>
                        <input
                            value={token}
                            className={styles.input}
                            type="password"
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Your Home Assistant access token"
                        />
                    </div>
                    {error && (
                        <div className={styles.errorContainer}>
                            <p className={styles.error}>{error}</p>
                        </div>
                    )}
                    <button
                        disabled={isLoading}
                        className={`${isLoading ? styles.checkInactive : styles.checkActive}`}
                        type="submit"
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}
