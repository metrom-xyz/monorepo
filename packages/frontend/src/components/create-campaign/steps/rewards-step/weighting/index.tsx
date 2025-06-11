import {
    NumberInput,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import type {
    AmmPoolLiquidityCampaignPayload,
    AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types/campaign";

import styles from "./styles.module.css";

interface WeightingProps {
    open?: boolean;
    pool?: AmmPoolLiquidityCampaignPayload["pool"];
    weighting?: AmmPoolLiquidityCampaignPayload["weighting"];
    onWeightingChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
}

export function Weighting({
    open,
    pool,
    weighting,
    onWeightingChange,
}: WeightingProps) {
    const t = useTranslations("newCampaign.form.base.rewards.weighting");

    const [token0, setToken0] = useState<number | undefined>(weighting?.token0);
    const [token1, setToken1] = useState<number | undefined>(weighting?.token1);

    const leftFee = useMemo(() => {
        return Math.max(100 - (token0 || 0) - (token1 || 0), 0);
    }, [token0, token1]);

    useEffect(() => {
        if (open) return;

        setToken0(undefined);
        setToken1(undefined);
        onWeightingChange({ weighting: undefined });
    }, [open, onWeightingChange]);

    function handleToken0OnChange({ floatValue }: NumberFormatValues) {
        if (floatValue) setToken0(floatValue);
        else setToken0(0);
    }

    function handleToken1OnChange({ floatValue }: NumberFormatValues) {
        if (floatValue) setToken1(floatValue);
        else setToken1(0);
    }

    const handleToken0OnBlur = useCallback(() => {
        const newToken0 = Math.min(token0 || 0, 100 - (token1 || 0));

        setToken0(newToken0);
        onWeightingChange({
            weighting: {
                token0: newToken0,
                token1: token1 || 0,
                liquidity: leftFee,
            },
        });
    }, [token0, token1, leftFee, onWeightingChange]);

    const handleToken1OnBlur = useCallback(() => {
        const newToken1 = Math.min(token1 || 0, 100 - (token0 || 0));

        setToken1(newToken1);
        onWeightingChange({
            weighting: {
                token0: token0 || 0,
                token1: newToken1,
                liquidity: leftFee,
            },
        });
    }, [token0, token1, leftFee, onWeightingChange]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ ease: easeInOut, duration: 0.2 }}
                    className={styles.root}
                >
                    <Typography
                        uppercase
                        light
                        weight="medium"
                        size="xs"
                        className={styles.title}
                    >
                        {t("title")}
                    </Typography>
                    <div className={styles.inputsWrapper}>
                        <NumberInput
                            prefixElement={
                                <Typography
                                    uppercase
                                    light
                                    weight="medium"
                                    size="xs"
                                >
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
                                <Typography
                                    uppercase
                                    light
                                    weight="medium"
                                    size="xs"
                                >
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
                                <Typography
                                    uppercase
                                    light
                                    weight="medium"
                                    size="xs"
                                >
                                    {t("fees")}
                                </Typography>
                            }
                            size="sm"
                            readOnly
                            suffix="%"
                            allowNegative={false}
                            value={leftFee}
                            className={styles.input}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
