import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Campaign } from "../../entities";
import { query, type GetCampaignsQueryResult, GetCampaigns } from "./queries";
import { resolveAmmSubgraphClient } from "../../utils/amm";
import type { AmmSubgraphClient } from "./amm";

const PAGE_SIZE = 25;

export type GetCampaignsQueryParams = {
    limit: number;
    pairParts?: string;
};

export type FetchCampaignsParams = {
    limit?: number;
};

export class MetromSubgraphClient {
    public constructor(
        public readonly chain: SupportedChain,
        public readonly url: string,
        public readonly ammClients: AmmSubgraphClient[],
    ) {}

    async fetchCampaigns(params?: FetchCampaignsParams): Promise<Campaign[]> {
        let lastId = null;
        let campaigns = [];
        do {
            const result: GetCampaignsQueryResult = await query(
                this.url,
                GetCampaigns,
                { limit: params?.limit || PAGE_SIZE, lastId: lastId || "" },
            );

            campaigns = (await Promise.all(
                result.campaigns.map(async (campaign) => {
                    const resolvedAmm = await resolveAmmSubgraphClient(
                        campaign.pool,
                        this.ammClients,
                    );

                    return {
                        id: campaign.id,
                        timestamp: campaign.transaction.timestamp,
                        amm: resolvedAmm.slug,
                        chainId: resolvedAmm.chain,
                        pairChainId: Number(campaign.chainId),
                        from: campaign.from,
                        to: campaign.to,
                        specification: campaign.specification,
                        root: campaign.root,
                        data: campaign.data,
                        pair: await resolvedAmm.fetchPair({
                            address: campaign.pool,
                        }),
                        rewards: campaign.rewards.map((reward) => ({
                            id: reward.id,
                            token: {
                                chainId: resolvedAmm.chain,
                                address: reward.token.address,
                                decimals: parseInt(reward.token.decimals),
                                name: reward.token.name,
                                symbol: reward.token.symbol,
                            },
                            amount: reward.amount,
                            unclaimed: reward.unclaimed,
                        })),
                    };
                }),
            )) as Campaign[];

            lastId =
                result.campaigns.length < PAGE_SIZE
                    ? null
                    : result.campaigns[result.campaigns.length - 1].id;
        } while (lastId);

        return campaigns.sort((a, b) => b.timestamp - a.timestamp);
    }
}
