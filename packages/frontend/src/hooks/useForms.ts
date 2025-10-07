import type { CampaignType } from "@metrom-xyz/sdk";
import { useChainData } from "./useChainData";

interface UseFormsProps {
    chainId: number;
    type?: CampaignType;
    partner?: boolean;
}

export function useForms({ chainId, type, partner }: UseFormsProps) {
    const data = useChainData({ chainId });
    if (!data) return [];

    return data.forms.filter((form) => {
        if (partner !== undefined && partner !== form.partner) return false;
        if (type !== undefined && type !== form.type) return false;
        return form.active;
    });
}
