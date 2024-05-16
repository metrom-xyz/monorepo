import type { Pool } from "sdk";

export interface CampaignsTableDepositProps {
    pool: Pool;
    chainId: number;
    ammSlug: string;
}
