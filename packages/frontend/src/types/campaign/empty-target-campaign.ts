import { CampaignKind } from "@metrom-xyz/sdk";
import { BaseCampaignPreviewPayload, type TargetValue } from "./common";

export class EmptyTargetCampaignPreviewPayload extends BaseCampaignPreviewPayload {
    public readonly kind: CampaignKind = CampaignKind.EmptyTarget;
    constructor(
        ...baseArgs: ConstructorParameters<typeof BaseCampaignPreviewPayload>
    ) {
        super(...baseArgs);
    }

    getTargetValue(): TargetValue | undefined {
        return undefined;
    }
}
