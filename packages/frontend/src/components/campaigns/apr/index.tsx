"use client";

import { Typography } from "@/src/ui/typography";
import styles from "./styles.module.css";
import { formatDecimals } from "@metrom-xyz/sdk";

interface AprProps {
    apr: number | null;
}

export function Apr({ apr }: AprProps) {
    return (
        <div className={styles.root}>
            <Typography weight="medium">
                {apr
                    ? formatDecimals({
                          number: apr.toString(),
                      })
                    : "-"}
                %
            </Typography>
        </div>
    );
}
