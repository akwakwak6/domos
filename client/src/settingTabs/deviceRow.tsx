import styles from "./setting.module.scss";
import { DeviceDto } from "@shared";
import { memo } from "react";

type DeviceRowProps = {
    device: DeviceDto;
    onChange: (device: DeviceDto) => void;
    onDelete?: (deviceId: string) => void;
};

export const DeviceRow = memo(
    ({ device, onChange, onDelete }: DeviceRowProps) => {
        return (
            <tr key={device.id}>
                <td className={styles.deviceId}>{device.id}</td>
                <td className={styles.deviceName}>
                    <input
                        type="text"
                        value={device.name}
                        onChange={(e) => onChange({ ...device, name: e.target.value })}
                        className={styles.nameInput}
                    />
                </td>
                <td className={styles.deviceType}>{device.type}</td>
                <td>
                    <span className={`${styles.status} ${device.wasDetected ? styles.detected : styles.notDetected}`}>
                        {device.wasDetected ? "Detected" : "Not Detected"}
                    </span>
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={device.isUsed}
                        onChange={(e) => onChange({ ...device, isUsed: e.target.checked })}
                        className={styles.enableCheckbox}
                    />
                </td>
                <td>
                    <button
                        onClick={() => onDelete?.(device.id)}
                        disabled={device.wasDetected}
                        className={`${styles.deleteButton} ${device.wasDetected ? styles.disabled : ""}`}
                    >
                        Delete
                    </button>
                </td>
            </tr>
        );
    },
    (prev, next) => {
        const a = prev.device;
        const b = next.device;
        return (
            a.id === b.id &&
            a.name === b.name &&
            a.isUsed === b.isUsed &&
            a.wasDetected === b.wasDetected &&
            a.type === b.type
        );
    }
);
