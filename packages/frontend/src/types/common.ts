import {
    Status,
    type UsdPricedOnChainAmount,
    type WhitelistedErc20Token,
} from "@metrom-xyz/sdk";
import type { SVGProps } from "react";

export enum Theme {
    System = "system",
    Dark = "dark",
    Light = "light",
}

export enum FilterableStatus {
    All = "",
    Live = Status.Live,
    Upcoming = Status.Upcoming,
    Ended = Status.Ended,
}

export type SVGIcon = Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML">;

export interface WhitelistedErc20TokenAmount {
    token: WhitelistedErc20Token;
    amount: UsdPricedOnChainAmount;
}

export enum LiquityV2Action {
    Debt = "debt",
    StabilityPool = "stabilty-pool",
}
