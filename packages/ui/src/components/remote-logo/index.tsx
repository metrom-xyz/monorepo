import { useCallback, useMemo, useState, type FunctionComponent } from "react";
import { type Address } from "viem";
import classNames from "classnames";
import { Skeleton } from "../skeleton";
import { Typography } from "../typography";
import type { SVGIcon } from "../../assets/types";

import styles from "./styles.module.css";

export type RemoteLogoSize = "xs" | "sm" | "base" | "lg" | "xl";

export interface RemoteLogoProps {
    loading?: boolean;
    src?: string;
    address?: Address;
    chain?: number;
    size?: RemoteLogoSize;
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
    size = "base",
    defaultText = "?",
    className,
    icon: Icon,
}: RemoteLogoProps) => {
    const [imageError, setImageError] = useState(false);

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
            <div className={classNames(styles.root, styles[size], className)}>
                <Skeleton
                    circular
                    className={classNames(styles[size], className)}
                />
            </div>
        );
    }

    if (Icon) {
        return (
            <div className={classNames(styles.root, styles[size], className)}>
                <Icon className={classNames(styles.image, styles[size])} />
            </div>
        );
    }

    if (validResolvedSrc) {
        return (
            <div className={classNames(styles.root, styles[size], className)}>
                <img
                    src={validResolvedSrc}
                    alt={defaultText}
                    className={classNames(styles.image, styles[size])}
                    onError={handleImageError}
                />
            </div>
        );
    }

    return (
        <div className={classNames(styles.fallback, styles[size], className)}>
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
