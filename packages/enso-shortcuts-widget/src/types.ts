import { RouteData } from "@ensofinance/sdk";
import { SVGProps } from "react";
import { Address } from "viem";

export type SVGIcon = Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML">;

export type Token = {
    address: Address;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    underlyingTokens?: Token[];
    type?: string;
    apy?: number;
    tvl?: number;
};

export type SuccessDetails = {
    amountIn: string;
    tokenIn: Token;
    tokenOut: Token;
    slippage: number;
    routerData: RouteData;
};

export type Placement =
    | "top-start"
    | "top"
    | "top-end"
    | "bottom-start"
    | "bottom"
    | "bottom-end";

export type WidgetState = {
    tokenIn?: Address;
    tokenOut?: Address;
    chainId?: number;
    outChainId?: number;
    outProject?: string;
};

export type ProjectFilter = {
    include: string[];
    exclude: string[];
};

export type WidgetComponentProps = {
    referralCode?: string;
    tokenOut?: Address;
    tokenIn?: Address;
    obligateSelection?: boolean;
    enableShare?: boolean;
    indicateRoute?: boolean;
    rotateObligated?: boolean | ObligatedToken;
    outProject?: string;
    outProjects?: ProjectFilter;
    inProjects?: ProjectFilter;
    outTokens?: {
        include: Address[];
        exclude: Address[];
    };
    inTokens?: {
        exclude: Address[];
    };
    onConnectWallet?: () => void;
    onSuccess?: (hash: string, details?: SuccessDetails) => void;
};

export enum NotifyType {
    Success = "success",
    Error = "error",
    Info = "info",
    Loading = "loading",
    Warning = "warning",
    Blocked = "blocked",
}

export enum ObligatedToken {
    TokenIn,
    TokenOut,
}
