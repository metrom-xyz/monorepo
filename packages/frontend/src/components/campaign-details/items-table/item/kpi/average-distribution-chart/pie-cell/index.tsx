import { Sector, type PieSectorShapeProps } from "recharts";
import type { AverageDistributionChartData } from "..";
import { useCallback } from "react";

import styles from "./styles.module.css";
import classNames from "classnames";

interface PieCellProps extends PieSectorShapeProps {
    type?: AverageDistributionChartData["type"];
    onPopoverChange: (type?: AverageDistributionChartData["type"]) => void;
}

export function PieCell({ type, onPopoverChange, ...rest }: PieCellProps) {
    const handlePopoverOpen = useCallback(() => {
        if (!type) return;
        onPopoverChange(type);
    }, [onPopoverChange, type]);

    const handlePopoverClose = useCallback(() => {
        onPopoverChange(undefined);
    }, [onPopoverChange]);

    if (!type) return <></>;

    return (
        <Sector
            {...rest}
            strokeWidth={5}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            className={classNames(styles.root, {
                [styles[type]]: true,
            })}
        />
    );
}
