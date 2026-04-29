import type {
    BaseCampaignPayloadPart,
    CampaignPayloadDistributables,
} from "@/src/types/campaign/common";
import { DistributablesType } from "@metrom-xyz/sdk";
import { RewardsPickerTokens } from "./tokens";
import type { FormSteps } from "@/src/context/form-steps";
import { RewardPoints } from "./points";

interface RewardsPickerProps {
    chainId?: number;
    campaignDuration?: number;
    value?: CampaignPayloadDistributables;
    onChange: (value: BaseCampaignPayloadPart) => void;
    onError: (errors: FormSteps<string>) => void;
}

export function RewardsPicker({
    chainId,
    campaignDuration,
    value,
    onChange,
    onError,
}: RewardsPickerProps) {
    if (value?.type === DistributablesType.FixedPoints)
        return (
            <RewardPoints
                chainId={chainId}
                campaignDuration={campaignDuration}
                value={value}
                onChange={onChange}
                onError={onError}
            />
        );

    if (value?.type === DistributablesType.Tokens)
        return (
            <RewardsPickerTokens
                chainId={chainId}
                campaignDuration={campaignDuration}
                value={value}
                onChange={onChange}
                onError={onError}
            />
        );
}
