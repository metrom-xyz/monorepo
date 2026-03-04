import type {
    BaseCampaignPayloadPart,
    CampaignPayloadDistributables,
    CampaignPayloadErrors,
} from "@/src/types/campaign/common";
import { DistributablesType } from "@metrom-xyz/sdk";
import { RewardsPickerTokens } from "./tokens";

interface RewardsPickerProps {
    chainId?: number;
    campaignDuration?: number;
    value?: CampaignPayloadDistributables;
    onChange: (value: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
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
