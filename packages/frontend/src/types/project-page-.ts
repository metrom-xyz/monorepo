import type { FunctionComponent } from "react";
import type { BrandColor, ProjectIntro, SVGIcon } from "./common";
import type { SupportedDex } from "@metrom-xyz/sdk";
import type { ChainWithType } from "./chain";

interface CampaignsFilters {
    chainId?: number;
    // TODO: add support for more filters
    dex?: SupportedDex;
}

export interface ProjectPage {
    chain: ChainWithType;
    name: string;
    description: string;
    url: string;
    brand: BrandColor;
    icon: FunctionComponent<SVGIcon>;
    intro?: ProjectIntro;
    campaignsFilters: CampaignsFilters;
}
