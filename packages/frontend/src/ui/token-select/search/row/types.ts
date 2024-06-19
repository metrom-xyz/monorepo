import type { TokenInfoWithBalance } from "@/components/campaign-creation-form/rewards/types";

export interface TokenSelectSearchRowProps extends TokenInfoWithBalance {
    selected?: boolean;
    loadingToken?: boolean;
    loadingBalance?: boolean;
    disabled?: boolean;
}
