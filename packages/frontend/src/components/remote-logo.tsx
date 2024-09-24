import {
    RemoteLogo as UiRemoteLogo,
    type RemoteLogoProps,
} from "@metrom-xyz/ui";
import { useTokenIconUri } from "../hooks/useTokenIconUri";

export function RemoteLogo({
    address,
    chain,
    src,
    loading,
    ...rest
}: RemoteLogoProps) {
    const { loading: loadingUri, uri } = useTokenIconUri(chain, address);

    return (
        <UiRemoteLogo
            address={address}
            {...rest}
            src={src || uri}
            loading={loadingUri || loading}
        />
    );
}
