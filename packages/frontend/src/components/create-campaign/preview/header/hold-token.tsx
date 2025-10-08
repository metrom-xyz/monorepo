import { RemoteLogo } from "@/src/components/remote-logo";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import type { HoldTokenCampaignPreviewPayload } from "@/src/types/campaign";
import { getCampaignPreviewName } from "@/src/utils/campaign";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

interface HoldTokenProps {
    payload: HoldTokenCampaignPreviewPayload;
}

export function HoldToken({ payload }: HoldTokenProps) {
    const t = useTranslations();
    const { id: chainId } = useChainWithType();

    return (
        <>
            <RemoteLogo
                size="lg"
                chain={chainId}
                address={payload.token.address}
            />
            <Typography weight="medium" size="xl">
                {getCampaignPreviewName(t, payload)}
            </Typography>
        </>
    );
}
