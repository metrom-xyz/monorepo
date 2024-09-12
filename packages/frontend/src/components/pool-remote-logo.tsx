import {
    PoolRemoteLogo as UiPoolRemoteLogo,
    type PoolRemoteLogoProps,
} from "@metrom-xyz/ui";
import { type Address } from "viem";
import { useChainData } from "@/src/hooks/useChainData";

export function PoolRemoteLogo({
    chain,
    token0,
    token1,
    ...rest
}: PoolRemoteLogoProps) {
    const chainData = useChainData(chain);

    const [Token0Icon, Token1Icon] =
        chainData?.specialTokens && token0?.address && token1?.address
            ? [
                  chainData.specialTokens[
                      token0.address.toLowerCase() as Address
                  ],
                  chainData.specialTokens[
                      token1.address.toLowerCase() as Address
                  ],
              ]
            : [undefined, undefined];

    const [token0ResolvedSrc, token1ResolvedSrc] =
        chainData && token0?.address && token1?.address
            ? [
                  chainData.rewardTokenIcons[
                      token0.address.toLowerCase() as Address
                  ],
                  chainData.rewardTokenIcons[
                      token1.address.toLowerCase() as Address
                  ],
              ]
            : [undefined, undefined];

    return (
        <UiPoolRemoteLogo
            chain={chain}
            token0={{
                ...token0,
                icon: Token0Icon,
                src: token0?.src || token0ResolvedSrc,
            }}
            token1={{
                ...token1,
                icon: Token1Icon,
                src: token1?.src || token1ResolvedSrc,
            }}
            {...rest}
        />
    );
}
