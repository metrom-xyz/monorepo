import type { FunctionComponent } from "react";
import type { SupportedDex } from "@metrom-xyz/sdk";
import type { ChainWithType } from "./chain";
import type { Branding, ProjectIntro } from "./project";
import type { SVGIcon } from "./common";

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
    brand: Branding;
    icon: FunctionComponent<SVGIcon>;
    intro?: ProjectIntro;
    campaignsFilters: CampaignsFilters;
}
