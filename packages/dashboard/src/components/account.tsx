import { Typography, type TypographyProps } from "@metrom-xyz/ui";
import type { Address } from "viem";
import { mainnet } from "viem/chains";
import { useEnsName } from "wagmi";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "@/context/chain-type";
import { mainnetWagmiConfig } from "@/context/mainnet-wagmi-config";
import { shortenAddress } from "@/utils/address";

interface AccountProps extends Omit<TypographyProps, "children"> {
    address?: Address;
    className?: string;
}

export function Account({ address, className, ...rest }: AccountProps) {
    const { chainType } = useChainType();

    // ENS only exists on EVM: avoid querying with 32-byte Aptos addresses
    const { data: ensName } = useEnsName({
        address,
        chainId: mainnet.id,
        config: mainnetWagmiConfig,
        query: {
            enabled: chainType === ChainType.Evm && !!address,
        },
    });

    return (
        <Typography {...rest} className={className}>
            {ensName || shortenAddress(address as Address)}
        </Typography>
    );
}
