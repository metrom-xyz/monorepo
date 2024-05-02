import type { FinalizedState } from "@/types";
import type { ChainContract } from "viem";

export interface DeployButtonProps {
    metrom: ChainContract;
    state: FinalizedState;
    disabled?: boolean;
}
