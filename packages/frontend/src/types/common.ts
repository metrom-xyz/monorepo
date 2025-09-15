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

export interface BrandColor {
    main: string;
    light: string;
}

export interface Article {
    title: string;
    href: string;
}

export interface ProjectIntro {
    articles: Article[];
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

export enum AaveV3Action {
    Borrow = "borrow",
    Supply = "supply",
    NetSupply = "net-supply",
    BridgeAndSupply = "bridge-supply",
}
