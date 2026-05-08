import { CampaignKind, type Erc4626Vault } from "@metrom-xyz/sdk";
import {
    BaseCampaignPreviewPayload,
    type BaseCampaignPayload,
    type TargetValue,
} from "./common";
import type { PropertyUnion } from "../utils";
import type { Erc4626VaultProtocol } from "@metrom-xyz/chains";

export class Erc4626VaultCampaignPreviewPayload extends BaseCampaignPreviewPayload {
    public readonly kind: CampaignKind = CampaignKind.Erc4626Vault;
    constructor(
        public readonly brand: Erc4626VaultProtocol,
        public readonly vault: Erc4626Vault,
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);
    }

    getTargetValue(): TargetValue | undefined {
        return { usd: this.vault.usdTvl, raw: this.vault.totalAssets };
    }
}

export interface Erc4626VaultCampaignPayload extends BaseCampaignPayload {
    brand?: Erc4626VaultProtocol;
    vault?: Erc4626Vault;
}

export type Erc4626VaultCampaignPayloadPart =
    PropertyUnion<Erc4626VaultCampaignPayload>;

export function getErc4626VaultTargetValue(
    payload: Erc4626VaultCampaignPayload,
): TargetValue | undefined {
    const { vault } = payload;
    if (!vault) return undefined;

    return { usd: vault.usdTvl, raw: vault.totalAssets };
}

export function isErc4626VaultCampaignPayload(
    payload: BaseCampaignPayload,
): payload is Erc4626VaultCampaignPayload {
    return payload.kind === CampaignKind.Erc4626Vault;
}
