"use client";

import { TurtleCampaignDetails } from "@/src/components/turtle-campaign-details";
import { routing, type Locale } from "@/src/i18n/routing";
import { notFound } from "next/navigation";

export interface Params {
    campaignId: string;
    locale: Locale;
}

export interface TurtleDealDetailsPageProps {
    params: Promise<Params>;
}

export default async function TurtleCampaignDetailsPage({
    params,
}: TurtleDealDetailsPageProps) {
    const { locale, campaignId } = await params;

    if (!routing.locales.includes(locale)) notFound();

    return <TurtleCampaignDetails campaignId={campaignId} />;
}
