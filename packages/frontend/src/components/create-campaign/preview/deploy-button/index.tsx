import { APTOS } from "@/src/commons/env";
import { type CampaignPreviewPayload } from "@/src/types/campaign/common";
import type { Hex } from "viem";
import { DeployButtonEvm } from "./deploy-button-evm";
import { DeployButtonMvm } from "./deploy-button-mvm";

export interface DeployButtonProps {
    payload: CampaignPreviewPayload;
    specificationHash: Hex;
    uploadingSpecification: boolean;
    disabled?: boolean;
    onCreate: () => void;
}

export function DeployButton(props: DeployButtonProps) {
    if (APTOS) return <DeployButtonMvm {...props} />;
    return <DeployButtonEvm {...props} />;
}
