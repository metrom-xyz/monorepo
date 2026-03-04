import type { AmmPool, Weighting } from "@metrom-xyz/sdk";
import { NumberInput } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import type { NumberFormatValues } from "react-number-format";
import type { AmmPoolLiquidityCampaignPayloadPart } from "@/src/types/campaign/amm-pool-liquidity-campaign";

import styles from "./styles.module.css";

interface WeightingInputsProps {
    pool?: AmmPool;
    value?: Weighting;
    onChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
}

export function WeightingInputs({
    pool,
    value,
    onChange,
}: WeightingInputsProps) {
    const [token0, setToken0] = useState<number | undefined>(value?.token0);
    const [token1, setToken1] = useState<number | undefined>(value?.token1);

    const t = useTranslations("newCampaign.form.ammPoolLiquidity.weighting");

    const liquidity = useMemo(() => {
        return Math.max(100 - (token0 || 0) - (token1 || 0), 0);
    }, [token0, token1]);

    function handleToken0OnChange({ floatValue }: NumberFormatValues) {
        setToken0(floatValue);
    }

    function handleToken1OnChange({ floatValue }: NumberFormatValues) {
        setToken1(floatValue);
    }

    const handleToken0OnBlur = useCallback(() => {
        const newToken0 = Math.min(token0 || 0, 100 - (token1 || 0));

        setToken0(newToken0);
        onChange({
            weighting: {
                token0: newToken0,
                token1: token1 || 0,
                liquidity,
            },
        });
    }, [token0, token1, liquidity, onChange]);

    const handleToken1OnBlur = useCallback(() => {
        const newToken1 = Math.min(token1 || 0, 100 - (token0 || 0));

        setToken1(newToken1);
        onChange({
            weighting: {
                token0: token0 || 0,
                token1: newToken1,
                liquidity,
            },
        });
    }, [token0, token1, liquidity, onChange]);

    return (
        <div className={styles.root}>
            <div className={styles.inputsWrapper}>
                <NumberInput
                    label={pool?.tokens[0].symbol}
                    size="lg"
                    suffix="%"
                    allowNegative={false}
                    value={token0}
                    onValueChange={handleToken0OnChange}
                    onBlur={handleToken0OnBlur}
                    className={styles.input}
                />
                <NumberInput
                    label={pool?.tokens[1].symbol}
                    size="lg"
                    suffix="%"
                    allowNegative={false}
                    value={token1}
                    onValueChange={handleToken1OnChange}
                    onBlur={handleToken1OnBlur}
                    className={styles.input}
                />
                <NumberInput
                    label={t("fees")}
                    size="lg"
                    readOnly
                    suffix="%"
                    allowNegative={false}
                    value={liquidity}
                    className={styles.input}
                />
            </div>
        </div>
    );
}
