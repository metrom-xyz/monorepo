import type { DexProtocol } from "@metrom-xyz/chains";
import { type AmmPool, type Weighting, CampaignKind } from "@metrom-xyz/sdk";
import {
    BaseCampaignPreviewPayload,
    type BaseCampaignPayload,
    type TargetValue,
} from "./common";
import type { PropertyUnion } from "../utils";

export class AmmPoolLiquidityCampaignPreviewPayload extends BaseCampaignPreviewPayload {
    constructor(
        public readonly kind: CampaignKind,
        public readonly dex: DexProtocol,
        public readonly pool: AmmPool,
        public readonly weighting?: Weighting,
        public readonly priceRangeSpecification?: AugmentedPriceRangeSpecification,
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);

        if (
            kind !== CampaignKind.AmmPoolLiquidity &&
            kind !== CampaignKind.JumperWhitelistedAmmPoolLiquidity
        )
            throw new Error(
                `Unsupported kind ${kind} for amm pool liquidity campaign payload`,
            );
    }

    getTargetValue(): TargetValue | undefined {
        return { usd: this.pool.usdTvl, raw: this.pool.liquidity };
    }
}

export interface AugmentedPriceRangeBound {
    tick: number;
    price: number;
}

export interface AugmentedPriceRangeSpecification {
    token0To1: boolean;
    from: AugmentedPriceRangeBound;
    to: AugmentedPriceRangeBound;
}

export interface AmmPoolLiquidityCampaignPayload extends BaseCampaignPayload {
    dex?: DexProtocol;
    pool?: AmmPool;
    weighting?: Weighting;
    priceRangeSpecification?: AugmentedPriceRangeSpecification;
}

export type AmmPoolLiquidityCampaignPayloadPart =
    PropertyUnion<AmmPoolLiquidityCampaignPayload>;
