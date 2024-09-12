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

    return (
        <UiPoolRemoteLogo
            chain={chain}
            token0={{ ...token0, icon: Token0Icon }}
            token1={{ ...token1, icon: Token1Icon }}
            {...rest}
        />
    );
}
