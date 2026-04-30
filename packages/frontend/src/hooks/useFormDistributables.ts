import { getChainData } from "../utils/chain";
import { useActiveChains } from "./useActiveChains";
import { DistributablesType, type CampaignType } from "@metrom-xyz/sdk";

interface UseFormDistributablesProps {
    type: CampaignType;
}

export function useFormDistributables({ type }: UseFormDistributablesProps) {
    const chains = useActiveChains();

    let distributables = new Set<DistributablesType>();
    chains.forEach((chain) => {
        const data = getChainData(chain.id);
        if (!data) return;

        data.forms.forEach((form) => {
            if (!form.active || form.type !== type) return;
            distributables = distributables.union(new Set(form.distributables));
        });
    });

    return Array.from(distributables);
}
