import { Skeleton } from "@metrom-xyz/ui";
import { normalize } from "viem/ens";
import { blo } from "blo";
import { zeroAddress, type Address } from "viem";
import { useAccountName } from "@/src/hooks/useAccountName";
import { useAccountAvatar } from "@/src/hooks/useAccountAvatar";

import styles from "./styles.module.css";

interface AvatarProps {
    address?: string;
    height: number;
    width: number;
}

export function Avatar({ address, height, width }: AvatarProps) {
    const { data: ensName, isLoading: loadingEnsName } = useAccountName({
        address: address as Address,
    });
    const { data: ensAvatar, isLoading: loadingEnsAvatar } = useAccountAvatar({
        name: ensName ? normalize(ensName) : undefined,
    });

    const blockie = blo((address as Address) || zeroAddress);

    if (loadingEnsName || loadingEnsAvatar)
        return (
            <div style={{ width }}>
                <Skeleton height={height} width={width} circular />
            </div>
        );

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            alt="Avatar"
            height={height}
            width={width}
            src={ensAvatar || blockie}
            className={styles.root}
        />
    );
}
