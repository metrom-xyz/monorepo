import type { FungibleAssetInfo } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { FungibleAssetLogo } from "./fungible-asset-logo";
import { getErc20Protocol } from "@/src/utils/erc20";

interface FungibleAssetProps {
    chainId?: number;
    asset: FungibleAssetInfo;
}

export function FungibleAsset({ chainId, asset }: FungibleAssetProps) {
    const symbol =
        asset.details && asset.details.type === "lp"
            ? `${asset.details.baseTokenSymbol}/${asset.details.quoteTokenSymbol}`
            : asset.symbol;

    return (
        <>
            <FungibleAssetLogo chainId={chainId} asset={asset} />
            <Typography>{symbol}</Typography>
            <Typography size="sm" variant="tertiary">
                {asset.details?.type === "lp"
                    ? getErc20Protocol(asset)?.name
                    : asset.name}
            </Typography>
        </>
    );
}
