import type { TokenInfo } from "../../../../types";

export interface TokenSelectSearchRowProps extends TokenInfo {
    selected?: boolean;
    loadingToken?: boolean;
    loadingBalance?: boolean;
    disabled?: boolean;
}
