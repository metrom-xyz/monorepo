import { useCallback, useMemo, useState, type FunctionComponent } from "react";
import { type Address } from "viem";
import classNames from "classnames";
import { Skeleton } from "../skeleton";
import { Typography } from "../typography";

import styles from "./styles.module.css";
import type { SVGIcon } from "../../assets/types";

export interface RemoteLogoProps {
    loading?: boolean;
    src?: string;
    address?: Address;
    chain?: number;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    defaultText?: string;
    className?: string;
    icon?: FunctionComponent<SVGIcon>;
}

const BAD_SRC: Record<string, boolean> = {};

const CHAIN_ID_TO_NAME: Record<number, string> = {
    5000: "mantle",
};

export const RemoteLogo = ({
    loading,
    src,
    address,
    chain,
    size,
    defaultText = "?",
    className,
    icon: Icon,
}: RemoteLogoProps) => {
    const [imageError, setImageError] = useState(false);
    const sizeClass = size ? styles[size] : styles.selfAdjust;

    const resolvedSrc = useMemo(() => {
        if (src) return src;
        return !address || !chain
            ? ""
            : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${CHAIN_ID_TO_NAME[chain]}/assets/${address}/logo.png`;
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

    if (Icon) {
        return (
            <div className={classNames(styles.root, sizeClass, className)}>
                <Icon className={classNames(styles.image, sizeClass)} />
            </div>
        );
    }

    if (validResolvedSrc) {
        return (
            <div className={classNames(styles.root, sizeClass, className)}>
                <Skeleton circular width="100%" className={styles.skeleton} />
                <img
                    src={validResolvedSrc}
                    alt={defaultText}
                    className={classNames(styles.image, sizeClass)}
                    onError={handleImageError}
                />
            </div>
        );
    }

    return (
        <div className={classNames(styles.fallback, sizeClass, className)}>
            <Typography uppercase className={styles.fallbackText}>
                {defaultText
                    ? defaultText.length > 4
                        ? `${defaultText.slice(0, 4)}`
                        : defaultText
                    : "?"}
            </Typography>
        </div>
    );
};
