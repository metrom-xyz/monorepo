import type { Erc20Token } from "@metrom-xyz/sdk";
import type { RemoteLogoSize } from "@metrom-xyz/ui";
import { RemoteLogo } from "../remote-logo";
import { getErc20Protocol } from "@/src/utils/erc20";

interface FungibleAssetLogoProps {
    chainId?: number;
    size?: RemoteLogoSize;
    asset: Erc20Token;
}

export function FungibleAssetLogo({
    chainId,
    size = "xxs",
    asset,
}: FungibleAssetLogoProps) {
    if (!asset) return null;

    const ProtocolLogo = getErc20Protocol(asset)?.icon;

    <RemoteLogo
        chain={chainId}
        address={asset.address}
        size={size}
        fallback={ProtocolLogo}
    />;
}
