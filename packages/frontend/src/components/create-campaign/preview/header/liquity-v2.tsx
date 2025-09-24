import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { LiquityV2CampaignPreviewPayload } from "@/src/types/campaign";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { getCampaignPreviewName } from "@/src/utils/campaign";

interface LiquityV2Props {
    payload: LiquityV2CampaignPreviewPayload;
}

export function LiquityV2({ payload }: LiquityV2Props) {
    const t = useTranslations();
    const { id: chainId } = useChainWithType();

    return (
        <>
            <RemoteLogo
                size="lg"
                chain={chainId}
                address={payload.collateral.token.address}
            />
            <Typography weight="medium" size="xl">
                {getCampaignPreviewName(t, payload)}
            </Typography>
        </>
    );
}
