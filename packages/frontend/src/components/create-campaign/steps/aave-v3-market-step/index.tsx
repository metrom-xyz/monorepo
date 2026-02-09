import { useEffect, useMemo } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import {
    type AaveV3CampaignPayload,
    type AaveV3CampaignPayloadPart,
} from "@/src/types/campaign/common";
import { useChainData } from "@/src/hooks/useChainData";
import { ProtocolType, type AaveV3Protocol } from "@metrom-xyz/chains";

interface AaveV3MarketStepProps {
    brand?: AaveV3CampaignPayload["brand"];
    onMarketChange: (value: AaveV3CampaignPayloadPart) => void;
}

export function AaveV3MarketStep({
    brand,
    onMarketChange,
}: AaveV3MarketStepProps) {
    const { id: chainId, type: chainType } = useChainWithType();
    const chainData = useChainData({ chainId, chainType, crossVm: true });

    const markets = useMemo(() => {
        if (!chainData || !brand) return [];

        const protocol = chainData.protocols.find(
            ({ type, active, slug }) =>
                type === ProtocolType.AaveV3 && active && slug === brand?.slug,
        );

        if (!protocol) return [];

        return (protocol as AaveV3Protocol).markets;
    }, [chainData, brand]);

    useEffect(() => {
        if (!markets || markets.length === 0) return;
        onMarketChange({ market: markets[0] });
    }, [markets, onMarketChange]);

    if (markets.length === 0) return null;

    // TODO: implement once multiple markets are supported
    return null;
}
