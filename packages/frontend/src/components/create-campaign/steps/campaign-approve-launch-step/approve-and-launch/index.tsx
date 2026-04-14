import { APTOS } from "@/src/commons/env";
import { type CampaignPreviewPayload } from "@/src/types/campaign/common";
import type { Hex } from "viem";
import { ApproveAndDeployEvm } from "./approve-and-launch-evm";
import { ApproveAndDeployMvm } from "./approve-and-launch-mvm";

export interface ApproveAndLaunchProps {
    payload: CampaignPreviewPayload;
    specificationHash: Hex;
    uploadingSpecification: boolean;
    disabled?: boolean;
    onLaunch: () => void;
}

export function ApproveAndLaunch(props: ApproveAndLaunchProps) {
    if (APTOS) return <ApproveAndDeployMvm {...props} />;
    return <ApproveAndDeployEvm {...props} />;
}
