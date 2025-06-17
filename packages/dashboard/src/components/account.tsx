import { Typography, type TypographyProps } from "@metrom-xyz/ui";
import type { Address } from "viem";
import { mainnet } from "viem/chains";
import { useEnsName } from "wagmi";
import { mainnetWagmiConfig } from "./reown-app-kit-provider";
import { shortenAddress } from "@/utils/address";

interface AccountProps extends Omit<TypographyProps, "children"> {
    address?: Address;
    className?: string;
}

export function Account({ address, className, ...rest }: AccountProps) {
    const { data: ensName } = useEnsName({
        address,
        chainId: mainnet.id,
        config: mainnetWagmiConfig,
    });

    return (
        <Typography {...rest} className={className}>
            {ensName || shortenAddress(address as Address)}
        </Typography>
    );
}
