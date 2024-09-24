import {
    PoolRemoteLogo as UiPoolRemoteLogo,
    type PoolRemoteLogoProps,
} from "@metrom-xyz/ui";
import { useTokenIconUri } from "../hooks/useTokenIconUri";

export function PoolRemoteLogo({
    chain,
    token0,
    token1,
    ...rest
}: PoolRemoteLogoProps) {
    const { loading: loadingToken0Uri, uri: token0Uri } = useTokenIconUri(
        chain,
        token0?.address,
    );

    const { loading: loadingToken1Uri, uri: token1Uri } = useTokenIconUri(
        chain,
        token1?.address,
    );

    return (
        <UiPoolRemoteLogo
            chain={chain}
            token0={{
                ...token0,
                src: token0?.src || token0Uri,
            }}
            token1={{
                ...token1,
                src: token1?.src || token1Uri,
            }}
            loading={loadingToken0Uri || loadingToken1Uri}
            {...rest}
        />
    );
}
