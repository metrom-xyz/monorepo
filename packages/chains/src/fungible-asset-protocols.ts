import { FunctionComponent } from "react";
import { SVGIcon } from "./types/common";
import { CurveLogo, DeadboxLogo, UniswapLogo } from "./assets";

export interface FungibleAssetProtocol {
    id: string;
    name: string;
    icon: FunctionComponent<SVGIcon>;
}

export const FUNGIBLE_ASSET_PROTOCOLS: FungibleAssetProtocol[] = [
    {
        id: "uniswap-v2",
        name: "Uniswap V2",
        icon: UniswapLogo,
    },
    {
        id: "curve",
        name: "Curve",
        icon: CurveLogo,
    },
    {
        id: "dead-box",
        name: "Deadbox",
        icon: DeadboxLogo,
    },
] as const;
