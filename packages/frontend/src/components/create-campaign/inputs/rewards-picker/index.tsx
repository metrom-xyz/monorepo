import type {
    BaseCampaignPayloadPart,
    CampaignPayloadDistributables,
} from "@/src/types/campaign/common";
import { DistributablesType } from "@metrom-xyz/sdk";
import { RewardsPickerTokens } from "./tokens";
import type { FormSteps } from "@/src/context/form-validation";

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
    return (
        <>
            {/* TODO: implement inputs */}
            {value?.type === DistributablesType.FixedPoints && null}
            {value?.type === DistributablesType.Tokens && (
                <RewardsPickerTokens
                    chainId={chainId}
                    campaignDuration={campaignDuration}
                    value={value}
                    onChange={onChange}
                    onError={onError}
                />
            )}
        </>
    );
}
