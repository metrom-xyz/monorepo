import { type AaveV3Collateral, CampaignKind } from "@metrom-xyz/sdk";

interface GetUsdTvlParams {
    collateral?: AaveV3Collateral;
    kind?: CampaignKind;
}

export function getAaveV3UsdTarget({ collateral, kind }: GetUsdTvlParams) {
    if (!collateral || !kind) return undefined;

    if (kind === CampaignKind.AaveV3Borrow) return collateral.usdDebt;

    return collateral.usdSupply;
}
