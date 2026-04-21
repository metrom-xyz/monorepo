import type { CampaignType } from "@metrom-xyz/sdk";
import { useActiveChains } from "./useActiveChains";
import { getChainData } from "../utils/chain";

interface UseFormsProps {
    type: CampaignType;
    partner?: boolean;
}

export function useChainsForForm({ type, partner }: UseFormsProps) {
    const activeChains = useActiveChains();

    return activeChains.filter((chain) => {
        const data = getChainData(chain.id);
        if (!data) return false;

        const { forms } = data;

        if (
            partner !== undefined &&
            !forms.some((form) => form.partner === partner)
        )
            return false;

        return forms.some((form) => form.type === type);
    });
}
