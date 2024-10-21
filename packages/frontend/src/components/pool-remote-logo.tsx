import {
    PoolRemoteLogo as UiPoolRemoteLogo,
    type PoolRemoteLogoProps,
} from "@metrom-xyz/ui";
import { useTokenIconUris } from "../hooks/useTokenIconUris";

export function PoolRemoteLogo({
    chain,
    tokens,
    ...rest
}: PoolRemoteLogoProps) {
    const { loading, uris } = useTokenIconUris(
        chain,
        tokens?.map((token) => token.address) || [],
    );

    return (
        <UiPoolRemoteLogo
            chain={chain}
            tokens={tokens.map((token) => {
                let resolvedUri = token.address
                    ? uris?.[token.address]
                    : undefined;

                return {
                    ...token,
                    src: token?.src || resolvedUri,
                };
            })}
            loading={rest.loading || loading}
            {...rest}
        />
    );
}
