import { mainnetWagmiConfig } from "@/src/context/reown-app-kit";
import { Typography, type TypographyProps } from "@metrom-xyz/ui";
import type { Address } from "viem";
import { mainnet } from "viem/chains";
import { useEnsName } from "wagmi";
import { shortenAddress } from "../utils/address";
import { useMemo } from "react";

interface AccountProps extends Omit<TypographyProps, "children"> {
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
    const { data: ensName } = useEnsName({
        address,
        chainId: mainnet.id,
        config: mainnetWagmiConfig,
    });

    const account = useMemo(() => {
        if (!!ensName) return ensName;
        if (variant === "full") return address;

        return shortenAddress(address, variant === "long");
    }, [address, variant, ensName]);

    return (
        <Typography {...rest} className={className}>
            {account}
        </Typography>
    );
}
