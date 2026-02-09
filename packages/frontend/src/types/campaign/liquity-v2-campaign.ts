import { CampaignKind, type LiquityV2Collateral } from "@metrom-xyz/sdk";
import {
    BaseCampaignPreviewPayload,
    type BaseCampaignPayload,
    type TargetValue,
} from "./common";
import type { LiquityV2Protocol } from "@metrom-xyz/chains";
import type { PropertyUnion } from "../utils";

export class LiquityV2CampaignPreviewPayload extends BaseCampaignPreviewPayload {
    constructor(
        public readonly kind: CampaignKind,
        public readonly brand: LiquityV2Protocol,
        public readonly collateral: LiquityV2Collateral,
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);

        if (
            kind !== CampaignKind.LiquityV2Debt &&
            kind !== CampaignKind.LiquityV2StabilityPool
        )
            throw new Error(
                `Unsupported kind ${kind} for liquity-v2 campaign payload`,
            );
    }

    getTargetValue(): TargetValue | undefined {
        if (this.kind === CampaignKind.LiquityV2Debt)
            return {
                usd: this.collateral.usdMintedDebt,
                raw: this.collateral.liquidity,
            };
        if (this.kind === CampaignKind.LiquityV2StabilityPool)
            return {
                usd: this.collateral.usdStabilityPoolDebt,
                raw: this.collateral.liquidity,
            };

        return undefined;
    }
}

export interface LiquityV2CampaignPayload extends BaseCampaignPayload {
    brand?: LiquityV2Protocol;
    collateral?: LiquityV2Collateral;
}

export type LiquityV2CampaignPayloadPart =
    PropertyUnion<LiquityV2CampaignPayload>;
