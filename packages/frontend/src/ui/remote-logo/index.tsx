import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { type Address } from "viem";
import classNames from "@/src/utils/classes";
import { CHAIN_DATA } from "@/src/commons";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { Skeleton } from "../skeleton";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export interface RemoteLogoProps {
    loading?: boolean;
    src?: string;
    address?: Address;
    chain?: number | string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    defaultText?: string;
    className?: string;
}

const BAD_SRC: Record<string, boolean> = {};

export const RemoteLogo = ({
    loading,
    src,
    address,
    chain,
    size,
    defaultText = "?",
    className,
}: RemoteLogoProps) => {
    const [imageError, setImageError] = useState(false);
    const sizeClass = size ? styles[size] : styles.selfAdjust;
    const resolvedSrc = useMemo(() => {
        if (src) return src;
        if (!address || !chain) return "";

        return (
            CHAIN_DATA[chain as SupportedChain].rewardTokenIcons[address] ||
            `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${address}/logo.png`
        );
    }, [address, chain, src]);

    const validResolvedSrc = useMemo(() => {
        if (!resolvedSrc || BAD_SRC[resolvedSrc] || imageError) return null;
        return resolvedSrc;
    }, [resolvedSrc, imageError]);

    const handleImageError = useCallback(() => {
        if (resolvedSrc) {
            BAD_SRC[resolvedSrc] = true;
            setImageError(true);
        }
    }, [resolvedSrc]);

    if (loading) {
        return (
            <Skeleton circular className={classNames(sizeClass, className)} />
        );
    }

    if (validResolvedSrc) {
        return (
            <div className={classNames(styles.root, sizeClass, className)}>
                <Skeleton circular width="100%" className={styles.skeleton} />
                <Image
                    fill
                    src={validResolvedSrc}
                    alt={address || ""}
                    className={classNames(styles.image, sizeClass)}
                    onError={handleImageError}
                />
            </div>
        );
    }

    return (
        <div className={classNames(styles.fallback, sizeClass, className)}>
            <Typography uppercase className={styles.fallbackText}>
                {!!defaultText
                    ? defaultText.length > 4
                        ? `${defaultText.slice(0, 4)}`
                        : defaultText
                    : "?"}
            </Typography>
        </div>
    );
};
