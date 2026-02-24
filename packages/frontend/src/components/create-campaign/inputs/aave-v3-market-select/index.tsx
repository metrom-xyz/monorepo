import { useEffect, useMemo } from "react";
import type { AaveV3CampaignPayloadPart } from "@/src/types/campaign/aave-v3-campaign";
import { useChainData } from "@/src/hooks/useChainData";
import { ProtocolType, type AaveV3Protocol } from "@metrom-xyz/chains";
import { useChainType } from "@/src/hooks/useChainType";
import type { AaveV3Market } from "@metrom-xyz/sdk";

interface AaveV3MarketSelectProps {
    chainId?: number;
    brand?: AaveV3Protocol;
    value?: AaveV3Market;
    onChange: (value: AaveV3CampaignPayloadPart) => void;
}

export function AaveV3MarketSelect({
    chainId,
    brand,
    value,
    onChange,
}: AaveV3MarketSelectProps) {
    const chainType = useChainType();
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
        if (!chainId || !!value || !markets || markets.length === 0) return;
        onChange({ market: markets[0] });
    }, [chainId, value, markets, onChange]);

    if (markets.length === 0) return null;

    // TODO: implement once multiple markets are supported
    return null;
}
