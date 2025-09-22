import { getDeviceTypes, updateDeviceType } from "../services/settings.service";
import { useEffect, useRef, useState } from "react";
import styles from "./setting.module.scss";
import { DeviceTypeDto } from "@shared";

export default function DeviceTypesTab() {
    const [types, setTypes] = useState<DeviceTypeDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [pending, setPending] = useState<Partial<Record<DeviceTypeDto["type"], DeviceTypeDto>>>({});
    const debounceRef = useRef<number | null>(null);
    const pendingRef = useRef<Partial<Record<DeviceTypeDto["type"], DeviceTypeDto>>>(pending);
    useEffect(() => {
        pendingRef.current = pending;
    }, [pending]);

    useEffect(() => {
        const fetchTypes = async () => {
            const res = await getDeviceTypes();
            if (res) {
                setTypes(res);
                setError(null);
            } else {
                setError("Failed to load device types");
            }
            setLoading(false);
        };
        fetchTypes();
    }, []);

    const handleToggle = (typeValue: DeviceTypeDto["type"], isUsed: boolean) => {
        setTypes((prev) => prev.map((t) => (t.type === typeValue ? { ...t, isUsed } : t)));
        setPending((prev) => ({ ...prev, [typeValue]: { type: typeValue, isUsed } }));

        if (debounceRef.current) window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(async () => {
            const toSave = Object.values(pendingRef.current);
            if (toSave.length === 0) return;
            setSaving(true);
            let okAll = true;
            for (const t of toSave) {
                const ok = await updateDeviceType(t);
                if (!ok) okAll = false;
            }
            setSaving(false);
            if (!okAll) setError("Failed to save some device types");
            else setError(null);
            setPending({} as Partial<Record<DeviceTypeDto["type"], DeviceTypeDto>>);
        }, 500);
    };

    if (loading) return <div className={styles.loading}>Loading types...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.deviceContainer}>
            <h3 className={styles.title}>{types.length} Type(s)</h3>
            <div className={`${styles.tableContainer} ${styles.tableContainerRelative}`}>
                {saving && <div className={styles.savingOverlay}>Saving changes...</div>}
                <table className={styles.devicesTable}>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Used</th>
                        </tr>
                    </thead>
                    <tbody>
                        {types.map((t) => (
                            <tr key={t.type}>
                                <td>{t.type}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={t.isUsed}
                                        onChange={(e) => handleToggle(t.type, e.target.checked)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
