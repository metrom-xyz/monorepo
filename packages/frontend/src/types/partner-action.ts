import type { AaveV3Protocol, PartnerActionType } from "@metrom-xyz/chains";
import type {
    AaveV3Collateral,
    AaveV3Market,
    SupportedBridge,
} from "@metrom-xyz/sdk";
import type { CampaignKind } from "./campaign";

export interface AaveV3BridgeAndSupplyActionPayload {
    // type: PartnerActionType.BridgeAndSupply;
    kind: CampaignKind.AaveV3BridgeAndSupply;
    brand?: AaveV3Protocol;
    bridge?: SupportedBridge;
    market?: AaveV3Market;
    collateral?: AaveV3Collateral;
    boostingFactor: number;
}

export type PartnerActionPayload = AaveV3BridgeAndSupplyActionPayload;
