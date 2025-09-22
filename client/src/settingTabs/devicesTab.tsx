import { getDevices, updateDevices, deleteAllDevicesAndSync } from "../services/settings.service";
import { DeviceDto, UpdateDeviceDto } from "@shared";
import { useEffect, useRef, useState } from "react";
import styles from "./setting.module.scss";
import { DeviceRow } from "./deviceRow";

export function DevicesTab() {
    const [devices, setDevices] = useState<DeviceDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletingAll, setDeletingAll] = useState(false);

    const [pending, setPending] = useState<Record<string, UpdateDeviceDto>>({});
    const debounceRef = useRef<number | null>(null);

    const fetchEntities = async () => {
        const response = await getDevices();
        setError(null);
        if (response) {
            setDevices(response);
        } else {
            setError("Failed to load entities");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEntities();
    }, []);

    const handleDeviceChange = (device: DeviceDto) => {
        setDevices((prev) => prev.map((d) => (d.id === device.id ? device : d)));

        setPending((prev) => ({ ...prev, [device.id]: { id: device.id, name: device.name, isUsed: device.isUsed } }));

        if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
        }

        debounceRef.current = window.setTimeout(async () => {
            const updates = Object.values(pendingRef.current);
            if (updates.length === 0) return;
            setSaving(true);
            const ok = await updateDevices(updates);
            setSaving(false);
            if (!ok) {
                setError("Failed to save changes");
            } else {
                setError(null);
                setPending({});
            }
        }, 500);
    };

    const handleDeviceDelete = (deviceId: string) => {
        console.log("handleDeviceDelete", deviceId);
    };

    const pendingRef = useRef(pending);
    useEffect(() => {
        pendingRef.current = pending;
    }, [pending]);

    if (loading) {
        return <div className={styles.loading}>Loading devices...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (devices.length === 0) {
        return <div className={styles.empty}>No devices found</div>;
    }

    return (
        <div className={styles.deviceContainer}>
            <div className={styles.headerRow}>
                <h3 className={styles.headerTitle}>{devices.length} Device(s)</h3>
                <button
                    className={styles.deleteButton}
                    onClick={() => setShowConfirm(true)}
                    disabled={deletingAll}
                    title={"Delete all devices and sync"}
                >
                    {deletingAll ? "Deleting..." : "Delete all & sync"}
                </button>
            </div>
            <div className={`${styles.tableContainer} ${styles.tableContainerRelative}`}>
                {saving && <div className={styles.savingOverlay}>Saving changes...</div>}
                <table className={styles.devicesTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Used</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device) => (
                            <DeviceRow
                                key={device.id}
                                device={device}
                                onChange={handleDeviceChange}
                                onDelete={handleDeviceDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {showConfirm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h4 className={styles.modalTitle}>Delete all devices and sync?</h4>
                        <p>
                            This action will remove all devices from the database and trigger a full sync. Any unsaved
                            changes will be lost. This operation cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={deletingAll}
                                className={styles.btnSecondary}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setDeletingAll(true);
                                    const ok = await deleteAllDevicesAndSync();
                                    setDeletingAll(false);
                                    setShowConfirm(false);
                                    if (!ok) {
                                        setError("Failed to delete all devices and sync");
                                        return;
                                    }
                                    setPending({});
                                    setSaving(false);
                                    setError(null);
                                    setLoading(true);
                                    await fetchEntities();
                                }}
                                className={styles.btnDanger}
                                disabled={deletingAll}
                            >
                                Yes, delete and sync
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
