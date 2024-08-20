"use client";

import { Typography } from "@/src/ui/typography";
import { formatDecimals } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

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
