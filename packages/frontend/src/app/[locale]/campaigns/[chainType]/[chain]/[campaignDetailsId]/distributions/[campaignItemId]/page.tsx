import { Distributions } from "@/src/components/distributions";
import { routing, type Locale } from "@/src/i18n/routing";
import type { Hex } from "viem";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { ChainType } from "@metrom-xyz/sdk";

export interface Params {
    locale: Locale;
    chain: string;
    chainType: ChainType;
    campaignItemId: Hex;
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
    const { locale, chain, chainType, campaignItemId } = await params;

    if (!routing.locales.includes(locale)) notFound();

    setRequestLocale(locale);

    return (
        <Distributions
            chain={parseInt(chain)}
            chainType={chainType}
            campaignItemId={campaignItemId}
        />
    );
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
