import { SupportedOdysseyStrategy, type OdysseyAsset } from "@metrom-xyz/sdk";
import { ODYSSEY_BORROW_STRATEGIES } from "../commons/odyssey";

interface GetUsdTvlParams {
    strategy?: SupportedOdysseyStrategy;
    asset?: OdysseyAsset;
}

export function getOdysseyUsdTarget({ strategy, asset }: GetUsdTvlParams) {
    if (!strategy || !asset) return undefined;

    if (ODYSSEY_BORROW_STRATEGIES.includes(strategy))
        return asset.usdTotalDeposited;

    return asset.usdTotalAllocated;
}
