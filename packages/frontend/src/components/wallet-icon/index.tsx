import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./styles.module.css";

export function WalletIcon({
    iconUrl,
    name,
}: {
    iconUrl: string | (() => Promise<string>);
    name: string;
}) {
    const [src, setSrc] = useState(
        typeof iconUrl === "string" ? iconUrl : undefined,
    );

    useEffect(() => {
        if (typeof iconUrl === "function")
            iconUrl().then(setSrc).catch(console.error);
        else setSrc(iconUrl);
    }, [iconUrl]);

    if (!src) return <div className={styles.walletIcon} />;

    return (
        <Image
            alt={name}
            src={src}
            width={32}
            height={32}
            unoptimized
            className={styles.walletIcon}
        />
    );
}
