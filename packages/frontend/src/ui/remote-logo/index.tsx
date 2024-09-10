import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { type Address } from "viem";
import classNames from "@/src/utils/classes";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { Skeleton } from "../skeleton";
import { Typography } from "../typography";
import { useChainData } from "@/src/hooks/useChainData";

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
    const chainData = useChainData(chain as SupportedChain);

    const resolvedSrc = useMemo(() => {
        if (src) return src;
        if (!address || !chain || !chainData) return "";

        return (
            chainData.rewardTokenIcons[address] ||
            `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${address}/logo.png`
        );
    }, [address, chain, chainData, src]);

    const SpecialToken = useMemo(() => {
        if (!address || !chain || !chainData) return null;

        const specialToken =
            chainData.specialTokens?.[address.toLowerCase() as Address];
        if (!specialToken) return null;

        return specialToken;
    }, [address, chain, chainData]);

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

    if (SpecialToken) {
        return (
            <div className={classNames(styles.root, sizeClass, className)}>
                <SpecialToken className={classNames(styles.image, sizeClass)} />
            </div>
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
