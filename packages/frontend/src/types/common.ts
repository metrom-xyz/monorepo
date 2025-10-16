import {
    BackendCampaignStatus,
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
    Active = BackendCampaignStatus.Active,
    Upcoming = BackendCampaignStatus.Upcoming,
    Expired = BackendCampaignStatus.Expired,
}

export type SVGIcon = Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML">;

export interface WhitelistedErc20TokenAmount {
    token: WhitelistedErc20Token;
    amount: UsdPricedOnChainAmount;
}
