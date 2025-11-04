import { FunctionComponent } from "react";
import { SVGIcon } from "./common";
import {
    AaveV3Market,
    Erc20Token,
    SupportedAaveV3,
    SupportedDex,
    SupportedGmxV1,
    SupportedLiquityV2,
    TargetType,
} from "@metrom-xyz/sdk";

export enum ProtocolType {
    Dex = "dex",
    GmxV1Liquidity = "gmx-v1-liquidity",
    LiquityV2 = "liquity-v2",
    AaveV3 = "aave-v3",
}

export interface ProtocolBase<S = string, T = ProtocolType> {
    type: T;
    active: boolean;
    slug: S;
    name: string;
    logo: FunctionComponent<SVGIcon>;
    logoLight?: FunctionComponent<SVGIcon>;
}

export enum DepositUrlType {
    PathPoolAddress = "path-pool-address",
    PathTokenAddresses = "path-token-addresses",
    QueryTokenAddresses = "query-pool-addresses",
}

export interface DexProtocol
    extends ProtocolBase<SupportedDex, ProtocolType.Dex> {
    depositUrl: {
        type: DepositUrlType;
        template: string;
    };
    supportsFetchAllPools: boolean;
}

export interface GmxV1LiquidityProtocol
    extends ProtocolBase<SupportedGmxV1, ProtocolType.GmxV1Liquidity> {
    brand: string;
    actionUrl: string;
}

export interface LiquityV2Protocol
    extends ProtocolBase<SupportedLiquityV2, ProtocolType.LiquityV2> {
    debtToken: Erc20Token;
    actionUrls: Record<
        TargetType.LiquityV2Debt | TargetType.LiquityV2StabilityPool,
        string
    >;
}

export interface AaveV3Protocol
    extends ProtocolBase<SupportedAaveV3, ProtocolType.AaveV3> {
    markets: AaveV3Market[];
    actionUrls: Record<
        | TargetType.AaveV3Borrow
        | TargetType.AaveV3Supply
        | TargetType.AaveV3NetSupply
        | TargetType.AaveV3BridgeAndSupply,
        string
    >;
}

export type Protocol =
    | DexProtocol
    | GmxV1LiquidityProtocol
    | LiquityV2Protocol
    | AaveV3Protocol;
