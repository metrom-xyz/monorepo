import type { AaveV3Collateral } from "@metrom-xyz/sdk";
import { CampaignKind } from "../types/campaign";

interface GetUsdTvlParams {
    collateral?: AaveV3Collateral;
    kind?: CampaignKind;
}

export function getAaveV3UsdTvl({ collateral, kind }: GetUsdTvlParams) {
    if (!collateral || !kind) return undefined;

    if (kind === CampaignKind.AaveV3Borrow) return collateral.usdDebt;

    if (
        kind === CampaignKind.AaveV3Supply ||
        kind === CampaignKind.AaveV3BridgeAndSupply
    )
        return collateral.usdSupply;

    if (kind === CampaignKind.AaveV3NetSupply)
        return Math.max(collateral.usdSupply - collateral.usdDebt, 0);

    return undefined;
}
