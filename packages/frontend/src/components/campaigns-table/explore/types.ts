import type { Pool } from "@metrom-xyz/sdk";

export interface CampaignsTableExplorerProps {
    pool: Pool;
    chainId: number;
    ammSlug: string;
}
