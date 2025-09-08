import { Distributions } from "@/src/components/distributions";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { routing, type Locale } from "@/src/i18n/routing";
import type { Hex } from "viem";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { ChainType } from "@metrom-xyz/sdk";

export interface Params {
    locale: Locale;
    chain: string;
    chainType: ChainType;
    campaignId: Hex;
}

export interface DistributionsPageProps {
    params: Promise<Params>;
}

export const metadata = {
    title: "Distributions insight",
};

export default async function DistributionsPage({
    params,
}: DistributionsPageProps) {
    const { locale, chain, chainType, campaignId } = await params;

    if (!routing.locales.includes(locale)) notFound();

    setRequestLocale(locale);

    return (
        <Distributions
            chain={parseInt(chain)}
            chainType={chainType}
            campaignId={campaignId}
        />
    );
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
