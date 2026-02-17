import { Sector, type PieSectorShapeProps } from "recharts";

import styles from "./styles.module.css";

interface PieCellProps extends PieSectorShapeProps {
    color?: string;
}

export function PieCell({ color, ...rest }: PieCellProps) {
    if (!color) return <></>;

    return (
        <Sector
            {...rest}
            fill={color}
            strokeWidth={5}
            className={styles.root}
        />
    );
}
