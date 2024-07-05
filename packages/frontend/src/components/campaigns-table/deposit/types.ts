import type { Pool } from "@metrom-xyz/sdk";

export interface CampaignsTableDepositProps {
    pool: Pool;
    chainId: number;
    ammSlug: string;
}
