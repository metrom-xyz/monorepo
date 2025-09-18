import {
    NumberInput,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { AmmPoolLiquidityCampaignPayload } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface WeightingInputsProps {
    pool?: AmmPoolLiquidityCampaignPayload["pool"];
    token0?: number;
    token1?: number;
    liquidity?: number;
    onToken0Change: (value?: number) => void;
    onToken1Change: (value?: number) => void;
}

export function WeightingInputs({
    pool,
    token0,
    token1,
    liquidity,
    onToken0Change,
    onToken1Change,
}: WeightingInputsProps) {
    const t = useTranslations("newCampaign.form.base.weighting");

    // const [token0, setToken0] = useState<number | undefined>(weighting?.token0);
    // const [token1, setToken1] = useState<number | undefined>(weighting?.token1);

    // const leftFee = useMemo(() => {
    //     return Math.max(100 - (token0 || 0) - (token1 || 0), 0);
    // }, [token0, token1]);

    // useEffect(() => {
    //     if (open) return;

    //     setToken0(undefined);
    //     setToken1(undefined);
    //     onWeightingChange({ weighting: undefined });
    // }, [open, onWeightingChange]);

    function handleToken0OnChange({ floatValue }: NumberFormatValues) {
        if (floatValue) onToken0Change(floatValue);
        else onToken0Change(0);
    }

    function handleToken1OnChange({ floatValue }: NumberFormatValues) {
        if (floatValue) onToken1Change(floatValue);
        else onToken1Change(0);
    }

    const handleToken0OnBlur = useCallback(() => {
        const newToken0 = Math.min(token0 || 0, 100 - (token1 || 0));

        onToken0Change(newToken0);
        // onWeightingChange({
        //     weighting: {
        //         token0: newToken0,
        //         token1: token1 || 0,
        //         liquidity: leftFee,
        //     },
        // });
    }, [token0, token1, onToken0Change]);

    const handleToken1OnBlur = useCallback(() => {
        const newToken1 = Math.min(token1 || 0, 100 - (token0 || 0));

        onToken1Change(newToken1);
        // onWeightingChange({
        //     weighting: {
        //         token0: token0 || 0,
        //         token1: newToken1,
        //         liquidity: leftFee,
        //     },
        // });
    }, [token0, token1, onToken1Change]);

    return (
        <div className={styles.root}>
            <div className={styles.inputsWrapper}>
                <NumberInput
                    prefixElement={
                        <Typography uppercase light weight="medium" size="xs">
                            {pool?.tokens[0].symbol}
                        </Typography>
                    }
                    size="sm"
                    suffix="%"
                    allowNegative={false}
                    placeholder="0%"
                    value={token0}
                    onValueChange={handleToken0OnChange}
                    onBlur={handleToken0OnBlur}
                    className={styles.input}
                />
                <NumberInput
                    prefixElement={
                        <Typography uppercase light weight="medium" size="xs">
                            {pool?.tokens[1].symbol}
                        </Typography>
                    }
                    size="sm"
                    suffix="%"
                    allowNegative={false}
                    placeholder="0%"
                    value={token1}
                    onValueChange={handleToken1OnChange}
                    onBlur={handleToken1OnBlur}
                    className={styles.input}
                />
                <NumberInput
                    prefixElement={
                        <Typography uppercase light weight="medium" size="xs">
                            {t("fees")}
                        </Typography>
                    }
                    size="sm"
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
