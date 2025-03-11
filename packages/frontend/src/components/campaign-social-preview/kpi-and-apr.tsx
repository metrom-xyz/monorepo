import { formatPercentage } from "@/src/utils/format";

interface KpiAndAprProps {
    apr?: number;
    kpi?: boolean;
}

export function KpiAndApr({ apr, kpi }: KpiAndAprProps) {
    return (
        <div tw="flex" style={{ gap: 18 }}>
            {kpi && (
                <div tw="flex items-center py-1 px-3 rounded-lg bg-black">
                    <span tw="text-[24px] text-white">KPI</span>
                </div>
            )}
            {apr && (
                <div tw="flex py-1 px-3 rounded-lg bg-[#3c82f6]">
                    <span tw="text-[24px] text-white">
                        {formatPercentage({ percentage: apr })}
                    </span>
                </div>
            )}
        </div>
    );
}
