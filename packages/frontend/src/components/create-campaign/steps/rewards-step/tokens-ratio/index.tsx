import type {
    AmmPoolLiquidityCampaignPayload,
    AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types/common";
import {
    NumberInput,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import styles from "./styles.module.css";

interface TokensRatioProps {
    open?: boolean;
    pool?: AmmPoolLiquidityCampaignPayload["pool"];
    tokensRatio?: AmmPoolLiquidityCampaignPayload["tokensRatio"];
    onTokensRatioChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
}

export function TokensRatio({
    open,
    pool,
    tokensRatio,
    onTokensRatioChange,
}: TokensRatioProps) {
    const t = useTranslations("newCampaign.form.base.rewards.tokensRatio");

    const [token0, setToken0] = useState<number>(tokensRatio?.token0 || 0);
    const [token1, setToken1] = useState<number>(tokensRatio?.token1 || 0);

    const leftFee = useMemo(() => {
        return Math.max(100 - token0 - token1, 0);
    }, [token0, token1]);

    useEffect(() => {
        if (open) return;

        setToken0(0);
        setToken1(0);
        onTokensRatioChange({ tokensRatio: undefined });
    }, [open, onTokensRatioChange]);

    function handleToken0OnChange({ floatValue }: NumberFormatValues) {
        if (floatValue) setToken0(floatValue);
        else setToken0(0);
    }

    function handleToken1OnChange({ floatValue }: NumberFormatValues) {
        if (floatValue) setToken1(floatValue);
        else setToken1(0);
    }

    const handleToken0OnBlur = useCallback(() => {
        const newToken0 = Math.min(token0, 100 - token1);

        setToken0(newToken0);
        onTokensRatioChange({
            tokensRatio: { token0: newToken0, token1, fee: leftFee },
        });
    }, [token0, token1, leftFee, onTokensRatioChange]);

    const handleToken1OnBlur = useCallback(() => {
        const newToken1 = Math.min(token1, 100 - token0);

        setToken1(newToken1);
        onTokensRatioChange({
            tokensRatio: { token0, token1: newToken1, fee: leftFee },
        });
    }, [token0, token1, leftFee, onTokensRatioChange]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
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
