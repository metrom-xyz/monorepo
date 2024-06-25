import type { Address } from "viem";

export interface TokenInfo {
    readonly address: Address;
    readonly chainId: number;
    readonly symbol: string;
    readonly name: string;
    readonly decimals: number;
    readonly logoURI?: string;
    readonly minimumRate?: bigint;
    balance?: bigint;
}

export type { Range } from "./components/date-range-input/types";
export type {
    AccordionSelectOption,
    ValueType as AccordionValueType,
} from "./components/accordion-select/types";
export type {
    ListItem,
    ItemType as ListItemType,
} from "./components/list-input/types";
export type {
    SelectOption,
    ValueType as SelectValueType,
} from "./components/select/types";
