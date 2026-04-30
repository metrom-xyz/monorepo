import type { CampaignType, DistributablesType } from "@metrom-xyz/sdk";
import { useActiveChains } from "./useActiveChains";
import { getChainData } from "../utils/chain";

interface UseFormsProps {
    type: CampaignType;
    distributablesType: DistributablesType;
}

export function useFormChains({ type, distributablesType }: UseFormsProps) {
    const chains = useActiveChains();

    return chains.filter((chain) => {
        const data = getChainData(chain.id);
        if (!data) return false;

        return data.forms.find(
            (form) =>
                form.type === type &&
                form.distributables.includes(distributablesType),
        );
    });
}
