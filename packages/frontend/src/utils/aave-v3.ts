import { type AaveV3Collateral, CampaignKind } from "@metrom-xyz/sdk";

interface GetUsdTvlParams {
    collateral?: AaveV3Collateral;
    kind?: CampaignKind;
}

export function getAaveV3UsdTarget({ collateral, kind }: GetUsdTvlParams) {
    if (!collateral || !kind) return undefined;

    if (kind === CampaignKind.AaveV3Borrow) return collateral.usdDebt;

    if (
        kind === CampaignKind.AaveV3Supply ||
        kind === CampaignKind.AaveV3BridgeAndSupply
    )
        return collateral.usdSupply;

    if (kind === CampaignKind.AaveV3NetSupply) return collateral.usdNetSupply;

    return undefined;
}
