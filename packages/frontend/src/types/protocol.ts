import type { FunctionComponent } from "react";
import type { SVGIcon } from "./common";
import type {
    Erc20Token,
    SupportedDex,
    SupportedLiquityV2,
    TargetType,
} from "@metrom-xyz/sdk";

export enum ProtocolType {
    Dex = "dex",
    LiquityV2 = "liquity-v2",
}

export interface ProtocolBase<S = string> {
    slug: S;
    name: string;
    logo: FunctionComponent<SVGIcon>;
}

export enum DepositUrlType {
    PathPoolAddress = "path-pool-address",
    PathTokenAddresses = "path-token-addresses",
    QueryTokenAddresses = "query-pool-addresses",
}

export interface DexProtocol extends ProtocolBase<SupportedDex> {
    type: ProtocolType.Dex;
    depositUrl: {
        type: DepositUrlType;
        template: string;
    };
    supportsFetchAllPools: boolean;
}

export interface LiquityV2Protocol extends ProtocolBase<SupportedLiquityV2> {
    type: ProtocolType.LiquityV2;
    debtToken: Erc20Token;
    actionUrls: Record<
        TargetType.LiquityV2Debt | TargetType.LiquityV2StabilityPool,
        string
    >;
}

export type Protocol = DexProtocol | LiquityV2Protocol;
