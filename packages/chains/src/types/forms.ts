import { CampaignType, DistributablesType } from "@metrom-xyz/sdk";

export interface Form {
    active: boolean;
    partner: boolean;
    type: CampaignType;
    distributables: DistributablesType[];
}
