import { mainnetWagmiConfig } from "@/src/context/reown-app-kit";
import { Typography, type TypographyProps } from "@metrom-xyz/ui";
import type { Address } from "viem";
import { mainnet } from "viem/chains";
import { shortenAddress } from "../utils/address";
import { useMemo } from "react";
import { APTOS } from "../commons/env";
import { truncateAddress } from "@aptos-labs/wallet-adapter-react";
import { useAccountName } from "../hooks/useAccountName";

interface AccountProps extends Omit<TypographyProps, "children" | "variant"> {
    address?: Address;
    variant?: "full" | "long" | "short";
    className?: string;
}

export function Account({
    address,
    variant = "short",
    className,
    ...rest
}: AccountProps) {
    const { data: ensName } = useAccountName({
        address,
        chainId: mainnet.id,
        config: mainnetWagmiConfig,
    });

    const account = useMemo(() => {
        if (APTOS) return truncateAddress(address);
        if (ensName) return ensName;
        if (variant === "full") return address;

        return shortenAddress(address, variant === "long");
    }, [address, variant, ensName]);

    return (
        <Typography {...rest} className={className}>
            {account}
        </Typography>
    );
}
