import { Skeleton } from "@metrom-xyz/ui";
import { normalize } from "viem/ens";
import { blo, type Address } from "blo";
import { mainnet } from "viem/chains";
import { mainnetWagmiConfig } from "@/src/context/reown-app-kit";
import { zeroAddress } from "viem";
import { useAccountName } from "@/src/hooks/useAccountName";
import { useAccountAvatar } from "@/src/hooks/useAccountAvatar";

import styles from "./styles.module.css";

interface AvatarProps {
    address?: Address;
    height: number;
    width: number;
}

export function Avatar({ address, height, width }: AvatarProps) {
    const { data: ensName, isLoading: loadingEnsName } = useAccountName({
        address,
        chainId: mainnet.id,
        config: mainnetWagmiConfig,
    });
    const { data: ensAvatar, isLoading: loadingEnsAvatar } = useAccountAvatar({
        name: ensName ? normalize(ensName) : undefined,
        chainId: mainnet.id,
        config: mainnetWagmiConfig,
    });

    const blockie = blo(address || zeroAddress);

    if (loadingEnsName || loadingEnsAvatar)
        return (
            <div style={{ width }}>
                <Skeleton height={height} width={width} circular />
            </div>
        );

    return (
        <img
            alt="Avatar"
            height={height}
            width={width}
            src={ensAvatar || blockie}
            className={styles.root}
        />
    );
}
