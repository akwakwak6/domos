import { deleteAllLogs, getRunnerLogs } from "../services/settings.service";
import styles from "./setting.module.scss";
import { useEffect, useState } from "react";
import { RunnerLogDto } from "@shared";

export default function RunnerLogsTab() {
    const [logs, setLogs] = useState<RunnerLogDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchLogs = async () => {
        const res = await getRunnerLogs();
        if (res) {
            setLogs(res);
            setError(null);
        } else {
            setError("Failed to load runner logs");
        }
    };

    useEffect(() => {
        (async () => {
            await fetchLogs();
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        const id = window.setInterval(() => {
            fetchLogs();
        }, 1000);
        return () => window.clearInterval(id);
    }, []);

    if (loading) return <div className={styles.loading}>Loading logs...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    if (logs.length === 0) return <div className={styles.empty}>No logs</div>;

    return (
        <div className={styles.deviceContainer}>
            <div className={styles.headerRow}>
                <h3 className={styles.headerTitle}>{logs.length} Log(s)</h3>
                <button
                    className={styles.deleteButton}
                    onClick={() => setShowConfirm(true)}
                    disabled={deleting}
                    title={"Delete all logs"}
                >
                    {deleting ? "Deleting..." : "Delete all"}
                </button>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.devicesTable}>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((l, idx) => (
                            <tr key={idx}>
                                <td>{new Date(l.date).toLocaleString()}</td>
                                <td>{l.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showConfirm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h4 className={styles.modalTitle}>Delete all logs?</h4>
                        <p>This action will remove all logs from the database. This operation cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={deleting}
                                className={styles.btnSecondary}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setDeleting(true);
                                    const ok = await deleteAllLogs();
                                    setDeleting(false);
                                    setShowConfirm(false);
                                    if (!ok) {
                                        setError("Failed to delete logs");
                                        return;
                                    }
                                    setLoading(true);
                                    const refreshed = await getRunnerLogs();
                                    setLogs(refreshed ?? []);
                                    setLoading(false);
                                }}
                                className={styles.btnDanger}
                                disabled={deleting}
                            >
                                Yes, delete all
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
