import { useTokenInfo } from "@/src/hooks/useTokenInfo";
import { TokenChip, TokenChipLoading } from "../token-chip";

interface StakingTokenChipProps {
    address: string;
    chainId: number;
    onRemove: () => void;
}

export function StakingTokenChip({
    address,
    chainId,
    onRemove,
}: StakingTokenChipProps) {
    const { info: tokenInfo, loading } = useTokenInfo({ address });

    if (tokenInfo === undefined && loading) return <TokenChipLoading />;
    if (!tokenInfo) return <div>token not found</div>;

    return <TokenChip {...tokenInfo} chainId={chainId} onRemove={onRemove} />;
}
