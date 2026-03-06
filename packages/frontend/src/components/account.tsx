import { mainnetWagmiConfig } from "@/src/context/reown-app-kit";
import { Typography, type TypographyProps } from "@metrom-xyz/ui";
import type { Address } from "viem";
import { mainnet } from "viem/chains";
import { shortenAddress } from "../utils/address";
import { useMemo } from "react";
import { useAccountName } from "../hooks/useAccountName";

interface AccountProps extends Omit<TypographyProps, "children"> {
    address?: Address;
    length?: "full" | "long" | "short";
    className?: string;
}

export function Account({
    address,
    length = "short",
    className,
    ...rest
}: AccountProps) {
    const { data: ensName } = useAccountName({
        address,
        chainId: mainnet.id,
        config: mainnetWagmiConfig,
    });

    const account = useMemo(() => {
        if (ensName) return ensName;
        if (length === "full") return address;

        return shortenAddress(address, length === "long");
    }, [address, length, ensName]);

    return (
        <Typography {...rest} weight="medium" className={className}>
            {account}
        </Typography>
    );
}
