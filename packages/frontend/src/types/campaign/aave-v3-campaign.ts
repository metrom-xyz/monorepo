import {
    type AaveV3Collateral,
    type AaveV3Market,
    CampaignKind,
} from "@metrom-xyz/sdk";
import {
    BaseCampaignPreviewPayload,
    type BaseCampaignPayload,
    type TargetValue,
} from "./common";
import type { AaveV3Protocol } from "@metrom-xyz/chains";
import type { PropertyUnion } from "../utils";

export class AaveV3CampaignPreviewPayload extends BaseCampaignPreviewPayload {
    constructor(
        public readonly kind: CampaignKind,
        public readonly brand: AaveV3Protocol,
        public readonly market: AaveV3Market,
        public readonly collateral: AaveV3Collateral,
        public readonly usdNetSupply?: number,
        public readonly boostingFactor?: number,
        public readonly blacklistedCollaterals?: AaveV3Collateral[],
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);

        if (
            kind !== CampaignKind.AaveV3Borrow &&
            kind !== CampaignKind.AaveV3Supply &&
            kind !== CampaignKind.AaveV3NetSupply &&
            kind !== CampaignKind.AaveV3BridgeAndSupply
        )
            throw new Error(
                `Unsupported kind ${kind} for aave-v3 campaign payload`,
            );
    }

    getTargetValue(): TargetValue | undefined {
        if (this.kind === CampaignKind.AaveV3Borrow)
            return { usd: this.collateral.usdDebt, raw: this.collateral.debt };

        if (
            this.kind === CampaignKind.AaveV3NetSupply &&
            this.usdNetSupply !== undefined
        )
            return { usd: this.usdNetSupply };

        return {
            usd: this.collateral.usdSupply,
            raw: this.collateral.supply,
        };
    }
}

export interface AaveV3CampaignPayload extends BaseCampaignPayload {
    brand?: AaveV3Protocol;
    market?: AaveV3Market;
    collateral?: AaveV3Collateral;
    boostingFactor?: number;
    blacklistedCollaterals?: AaveV3Collateral[];
}

export type AaveV3CampaignPayloadPart = PropertyUnion<AaveV3CampaignPayload>;
