import { type CampaignPreviewPayload } from "@/src/types/campaign/common";
import type { Hex } from "viem";
import { ApproveAndDeployEvm } from "./approve-and-launch-evm";
import { ApproveAndDeployMvm } from "./approve-and-launch-mvm";
import { useChainType } from "@/src/hooks/useChainType";
import { ChainType } from "@metrom-xyz/sdk";
import { ApproveAndDeploySvm } from "./approve-and-launch-svm";

export interface ApproveAndLaunchProps {
    payload: CampaignPreviewPayload;
    specificationHash: Hex;
    uploadingSpecification: boolean;
    disabled?: boolean;
    onAllTokensApproved: (approved: boolean) => void;
    onLaunch: () => void;
}

export function ApproveAndLaunch(props: ApproveAndLaunchProps) {
    const chainType = useChainType();

    switch (chainType) {
        case ChainType.Evm:
            return <ApproveAndDeployEvm {...props} />;
        case ChainType.Aptos:
            return <ApproveAndDeployMvm {...props} />;
        case ChainType.Svm:
            return <ApproveAndDeploySvm {...props} />;
        default:
            throw new Error(`Unsupported chain type: ${chainType}`);
    }
}
