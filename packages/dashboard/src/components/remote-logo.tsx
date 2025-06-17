import {
    RemoteLogo as UiRemoteLogo,
    type RemoteLogoProps,
} from "@metrom-xyz/ui";
import { useTokenIconUris } from "../hooks/useTokenIconUris";

export function RemoteLogo({
    address,
    chain,
    src,
    loading,
    ...rest
}: RemoteLogoProps) {
    const { loading: loadingUri, uris } = useTokenIconUris(chain, [address]);

    return (
        <UiRemoteLogo
            address={address}
            {...rest}
            src={src || (address && uris?.[address])}
            loading={loadingUri || loading}
        />
    );
}
