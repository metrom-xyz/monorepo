import { Distributions } from "@/src/components/distributions";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { routing, type Locale } from "@/src/i18n/routing";
import type { Hex } from "viem";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export interface Params {
    locale: Locale;
    chain: SupportedChain;
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
    const { locale, chain, campaignId } = await params;

    if (!routing.locales.includes(locale)) notFound();

    setRequestLocale(locale);

    return <Distributions chain={chain} campaignId={campaignId} />;
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
