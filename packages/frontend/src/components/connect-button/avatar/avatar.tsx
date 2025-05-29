import { Skeleton } from "@metrom-xyz/ui";
import Image from "next/image";

import styles from "./styles.module.css";

interface AvatarProps {
    src: string;
    height: number;
    width: number;
    loading?: boolean;
}

export function Avatar({ src, height, width, loading }: AvatarProps) {
    if (loading)
        return (
            <div style={{ width }}>
                <Skeleton height={height} width={width} circular />
            </div>
        );

    return (
        <Image
            alt="Avatar"
            height={height}
            width={width}
            src={src}
            className={styles.root}
        />
    );
}
