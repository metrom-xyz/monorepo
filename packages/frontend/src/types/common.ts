import {
    type UsdPricedOnChainAmount,
    type WhitelistedErc20Token,
} from "@metrom-xyz/sdk";
import type { SVGProps } from "react";

export type SVGIcon = Omit<SVGProps<SVGSVGElement>, "dangerouslySetInnerHTML">;

export interface WhitelistedErc20TokenAmount {
    token: WhitelistedErc20Token;
    amount: UsdPricedOnChainAmount;
}
