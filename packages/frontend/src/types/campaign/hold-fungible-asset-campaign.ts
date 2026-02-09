import { CampaignKind, type FungibleAssetInfo } from "@metrom-xyz/sdk";
import {
    BaseCampaignPreviewPayload,
    type BaseCampaignPayload,
    type TargetValue,
} from "./common";
import type { PropertyUnion } from "../utils";

export class HoldFungibleAssetCampaignPreviewPayload extends BaseCampaignPreviewPayload {
    public readonly kind: CampaignKind = CampaignKind.HoldFungibleAsset;
    constructor(
        public readonly asset: FungibleAssetInfo,
        public readonly stakingAssets: FungibleAssetInfo[],
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);
    }

    getTargetValue(): TargetValue | undefined {
        return { usd: this.asset.usdTotalSupply, raw: this.asset.totalSupply };
    }
}

export interface HoldFungibleAssetCampaignPayload extends BaseCampaignPayload {
    asset?: FungibleAssetInfo;
    stakingAssets: FungibleAssetInfo[];
}

export type HoldFungibleAssetCampaignPayloadPart =
    PropertyUnion<HoldFungibleAssetCampaignPayload>;
