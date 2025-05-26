import { METROM_API_CLIENT, TOKEN_ICONS_URL } from "@/src/commons";
import { ImageResponse } from "next/og";
import type { CampaignDetailsPageProps } from "./page";
import { MetromSquareLogo } from "@/src/assets/metrom-square-logo";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Campaign } from "@/src/types/campaign";
import { getTranslations } from "next-intl/server";
import { getSocialPreviewCampaignName } from "@/src/utils/campaign";
import {
    DistributablesType,
    TargetType,
    type CampaignTarget,
} from "@metrom-xyz/sdk";
import type { Address } from "viem";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { notFound } from "next/navigation";
import { AmmLiquidityPool } from "@/src/components/campaign-social-preview/amm-liquidity-pool";
import { KpiAndApr } from "@/src/components/campaign-social-preview/kpi-and-apr";
import { TextField } from "@/src/components/campaign-social-preview/text-field";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { RemoteLogo } from "@/src/components/campaign-social-preview/remote-logo";
import { LiquityV2 } from "@/src/components/campaign-social-preview/liquity-v2";
import { PointsIcon } from "@/src/assets/points-icon";
import { getChainData } from "@/src/utils/chain";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const alt = "Metrom campaign";
export const size = {
    width: 1200,
    height: 675,
};
export const contentType = "image/png";

type TokenIcons = Record<number, Record<Address, string>>;

async function getCampaign(id: Address, chainId: SupportedChain) {
    try {
        const campaign = await METROM_API_CLIENT.fetchCampaign({
            id,
            chainId,
        });

        return new Campaign(
            campaign,
            await getSocialPreviewCampaignName(campaign),
            getChainData(chainId),
        );
    } catch (error) {
        console.error(
            `Could not find campaign with id ${id} in chain ${chainId}`,
        );
        notFound();
    }
}

function getCampaignTargetProtocol(
    chainId: SupportedChain,
    target: CampaignTarget,
) {
    return getChainData(chainId)?.protocols.find((protocol) => {
        switch (target.type) {
            case TargetType.AmmPoolLiquidity: {
                return protocol.slug === target.pool.dex.slug;
            }
            case TargetType.LiquityV2Debt:
            case TargetType.LiquityV2StabilityPool: {
                return protocol.slug === target.brand.slug;
            }
        }
    });
}

async function getTokenUris(
    chain: SupportedChain,
    addresses: Address[],
): Promise<Record<Address, string>> {
    const uris: Record<Address, string> = {};

    const response = await fetch(TOKEN_ICONS_URL, {
        cache: "force-cache",
    });
    if (!response.ok) throw new Error(await response.text());
    const tokenIcons = (await response.json()) as TokenIcons;

    if (chain && addresses && addresses.length > 0 && tokenIcons) {
        for (const address of addresses) {
            if (!address) continue;
            uris[address] =
                tokenIcons[chain]?.[address.toLowerCase() as Address];
        }
    }

    return uris;
}

export default async function Image({ params }: CampaignDetailsPageProps) {
    const { chain, campaignId } = await params;
    const t = await getTranslations();

    const ibmPlexSans = await readFile(
        join(process.cwd(), "assets/ibm-plex-sans-500.ttf"),
    );

    const campaign = await getCampaign(campaignId, chain);
    const protocol = getCampaignTargetProtocol(chain, campaign.target);

    let tokenAddresses: Address[] = [];
    if (campaign.isTargeting(TargetType.AmmPoolLiquidity))
        tokenAddresses.push(
            ...campaign.target.pool.tokens.map(({ address }) => address),
        );
    if (campaign.isDistributing(DistributablesType.Tokens))
        tokenAddresses.push(
            ...campaign.distributables.list.map(({ token }) => token.address),
        );

    const tokenUris = await getTokenUris(chain, tokenAddresses);

    const ammPoolLiquidity = campaign.isTargeting(TargetType.AmmPoolLiquidity);
    const liquityV2 =
        campaign.isTargeting(TargetType.LiquityV2Debt) ||
        campaign.isTargeting(TargetType.LiquityV2StabilityPool);

    return new ImageResponse(
        (
            <div
                tw="w-full h-full flex flex-col p-16 bg-gray-100"
                style={{ gap: 4 }}
            >
                <div
                    tw="w-full flex items-center justify-end"
                    style={{ gap: 12 }}
                >
                    <span tw="text-2xl">METROM.XYZ</span>
                    <MetromSquareLogo tw="h-12 w-12" />
                </div>
                <div tw="w-full flex items-center gap-6" style={{ gap: 24 }}>
                    {!!protocol?.logo && (
                        <protocol.logo style={{ height: 112, width: 112 }} />
                    )}
                    <span tw="text-[52px]">{campaign.name}</span>
                </div>
                <div
                    tw="flex flex-col p-7 rounded-2xl mt-16 bg-white"
                    style={{ gap: 64 }}
                >
                    <div tw="flex items-center justify-between">
                        <div tw="flex items-center">
                            {ammPoolLiquidity && (
                                <AmmLiquidityPool
                                    pool={campaign.target.pool}
                                    tokenUris={tokenUris}
                                />
                            )}
                            {liquityV2 && (
                                <LiquityV2
                                    collateral={campaign.target.collateral}
                                    tokenUris={tokenUris}
                                />
                            )}
                        </div>
                        <KpiAndApr
                            apr={campaign.apr}
                            kpi={!!campaign.specification?.kpi}
                        />
                    </div>
                    <div tw="flex items-center" style={{ gap: 24 }}>
                        {campaign.isDistributing(DistributablesType.Points) && (
                            <TextField
                                title={t("socialCampaignPreview.totalRewards")}
                                value={
                                    <div tw="flex items-center justify-between">
                                        <span tw="text-[30px]">
                                            {formatAmount({
                                                amount: campaign.distributables
                                                    .amount.formatted,
                                            })}
                                        </span>
                                        <div
                                            tw="relative flex"
                                            style={{ gap: 1 }}
                                        >
                                            <PointsIcon
                                                style={{
                                                    height: 46,
                                                    width: 46,
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
                            />
                        )}
                        {campaign.isDistributing(DistributablesType.Tokens) && (
                            <TextField
                                title={t("socialCampaignPreview.totalRewards")}
                                value={
                                    <div tw="flex items-center justify-between">
                                        <span tw="text-[30px]">
                                            {formatUsdAmount({
                                                amount: campaign.distributables
                                                    .amountUsdValue,
                                            })}
                                        </span>
                                        <div
                                            tw="relative flex"
                                            style={{ gap: 1 }}
                                        >
                                            {campaign.distributables.list.map(
                                                ({ token }, index) => (
                                                    <RemoteLogo
                                                        key={index}
                                                        src={
                                                            tokenUris[
                                                                token.address
                                                            ]
                                                        }
                                                        style={{
                                                            height: 46,
                                                            width: 46,
                                                            marginLeft:
                                                                index * -12,
                                                        }}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>
                                }
                            />
                        )}
                        <TextField
                            title={t("socialCampaignPreview.startDate")}
                            light
                            value={dayjs
                                .unix(campaign.from)
                                .format("DD/MMM/YY | HH:mm")
                                .toUpperCase()}
                        />
                        <TextField
                            title={t("socialCampaignPreview.duration")}
                            light
                            value={dayjs
                                .unix(campaign.from)
                                .to(dayjs.unix(campaign.to), true)}
                        />
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: "IBM Plex Sans Variable",
                    data: ibmPlexSans,
                    style: "normal",
                    weight: 500,
                },
            ],
        },
    );
}
