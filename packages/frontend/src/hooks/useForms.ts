import type { Form } from "@metrom-xyz/chains";
import { getChainData } from "../utils/chain";
import { useActiveChains } from "./useActiveChains";
import type { CampaignType, DistributablesType } from "@metrom-xyz/sdk";

interface UseFormsProps {
    type?: CampaignType;
    distributablesType?: DistributablesType;
}

interface UseFormsReturnValue {
    forms: Form[];
    partners: Form[];
}

export function useForms({
    type,
    distributablesType,
}: UseFormsProps = {}): UseFormsReturnValue {
    const chains = useActiveChains();

    const forms: Record<string, Form> = {};
    const partners: Record<string, Form> = {};
    chains.forEach((chain) => {
        const data = getChainData(chain.id);
        if (!data) return;

        data.forms.forEach((form) => {
            if (!form.active) return;
            if (type && form.type !== type) return;
            if (
                distributablesType &&
                !form.distributables.includes(distributablesType)
            )
                return;

            if (form.partner) partners[form.type] = form;
            else forms[form.type] = form;
        });
    });

    return { forms: Object.values(forms), partners: Object.values(partners) };
}
