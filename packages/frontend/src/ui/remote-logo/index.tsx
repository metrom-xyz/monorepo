import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { type Address } from "viem";
import classNames from "@/src/utils/classes";
import { getAddressColor } from "@/src/utils/address";
import { Skeleton } from "../skeleton";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export interface RemoteLogoProps {
    src?: string;
    address?: Address;
    chain?: number | string;
    size?: "xs" | "sm" | "md" | "lg";
    defaultText?: string;
    className?: { root: string };
}

const BAD_SRC: Record<string, boolean> = {};

export const RemoteLogo = ({
    src,
    address,
    chain,
    size = "md",
    defaultText = "?",
    className,
}: RemoteLogoProps) => {
    const [imageError, setImageError] = useState(false);

    const resolvedSrc = useMemo(() => {
        if (src) return src;
        if (!address || !chain) return "";
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${address}/logo.png`;
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

    if (validResolvedSrc) {
        return (
            <div
                className={classNames(className?.root, styles.root, {
                    [styles[size]]: true,
                })}
            >
                <Skeleton
                    circular
                    width="100%"
                    className={{ root: styles.skeleton }}
                />
                <Image
                    fill
                    src={validResolvedSrc}
                    alt={address || ""}
                    className={classNames(styles.image, {
                        [styles[size]]: true,
                    })}
                    onError={handleImageError}
                />
            </div>
        );
    }

    return (
        <div className={`${styles.fallback} ${styles[size]}`}>
            <Typography uppercase className={{ root: styles.fallbackText }}>
                {!!defaultText
                    ? defaultText.length > 4
                        ? `${defaultText.slice(0, 4)}`
                        : defaultText
                    : "?"}
            </Typography>
        </div>
    );
};
