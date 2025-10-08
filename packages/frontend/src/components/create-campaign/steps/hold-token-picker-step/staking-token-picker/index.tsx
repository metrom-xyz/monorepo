import type { LocalizedMessage } from "@/src/types/utils";
import { Button, TextInput, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { type Address } from "viem";
import { isAddress } from "@/src/utils/address";
import { useTokenInfo } from "@/src/hooks/useTokenInfo";
import { TokenChip, TokenChipLoading } from "../token-chip";
import type { TokenInfo } from "@/src/types/common";

import styles from "./styles.module.css";

type ErrorMessage = LocalizedMessage<"newCampaign.form.holdToken.picker">;

interface StakingTokenPickerProps {
    disabled?: boolean;
    chainId: number;
    stakingTokens: TokenInfo[];
    onChange: (stakingTokens: TokenInfo[]) => void;
    onError: (error: ErrorMessage) => void;
}

export const MAXIMUM_STAKING_TOKEN_ADDRESSES = 5;

export function StakingTokenPicker({
    disabled,
    chainId,
    stakingTokens,
    onChange,
    onError,
}: StakingTokenPickerProps) {
    const t = useTranslations("newCampaign.form.holdToken.picker");

    const [tokenAddress, setTokenAddress] = useState("");
    const [blurTokenAddress, setBlurTokenAddress] = useState("");
    const [error, setError] = useState<ErrorMessage>("");

    const { info: tokenInfo, loading: loadingTokenInfo } = useTokenInfo({
        address: blurTokenAddress,
        enabled: isAddress(blurTokenAddress) && !disabled,
    });

    useEffect(() => {
        if (!tokenAddress) {
            setError("");
            onError("");
            return;
        }

        let error: ErrorMessage = "";
        if (!isAddress(tokenAddress)) error = "errors.notAnAddress";
        else if (
            stakingTokens.find(
                (stakingToken) => stakingToken.address === blurTokenAddress,
            )
        )
            error = "errors.alreadyAdded";
        else if (tokenInfo === null) error = "errors.notFound";
        else error = "";

        setError(error);
        onError(error);
    }, [tokenAddress, tokenInfo, blurTokenAddress, stakingTokens, onError]);

    function handleTokenOnChange(event: ChangeEvent<HTMLInputElement>) {
        const token = event.target.value as Address;
        setTokenAddress(token);
    }

    const handleTokenOnBlur = useCallback(() => {
        setBlurTokenAddress(tokenAddress);
    }, [tokenAddress]);

    const handleOnAddStakingToken = useCallback(() => {
        if (!tokenInfo) return;

        setTokenAddress("");
        setBlurTokenAddress("");
        onChange([...stakingTokens, tokenInfo]);
    }, [stakingTokens, tokenInfo, onChange]);

    const getRemoveStakingTokenHandler = useCallback(
        (toRemove: Address) => {
            return () => {
                onChange(
                    stakingTokens.filter(
                        (stakingToken) => stakingToken.address !== toRemove,
                    ),
                );
            };
        },
        [stakingTokens, onChange],
    );

    return (
        <div className={styles.root}>
            <div className={styles.inputWrapper}>
                <Typography weight="medium" size="xs" uppercase light>
                    {t("tokenAddressInput.label")}
                </Typography>
                {tokenInfo === undefined && loadingTokenInfo ? (
                    <TokenChipLoading />
                ) : (
                    <TextInput
                        placeholder={t("stakingTokenAddressInput.placeholder")}
                        value={tokenAddress}
                        disabled={disabled}
                        error={!!error}
                        onBlur={handleTokenOnBlur}
                        onChange={handleTokenOnChange}
                    />
                )}
            </div>
            <Button
                variant="secondary"
                size="sm"
                disabled={
                    disabled ||
                    !!error ||
                    !tokenAddress ||
                    stakingTokens.length >= MAXIMUM_STAKING_TOKEN_ADDRESSES
                }
                onClick={handleOnAddStakingToken}
                className={{ root: styles.addButton }}
            >
                {stakingTokens.length >= MAXIMUM_STAKING_TOKEN_ADDRESSES
                    ? t("maxTokensLimit")
                    : t("add")}
            </Button>
            {stakingTokens.length > 0 && (
                <>
                    <div className={styles.divider}></div>
                    <div className={styles.listWrapper}>
                        <Typography weight="medium" light size="xs" uppercase>
                            {t("list")}
                        </Typography>
                        <div className={styles.list}>
                            {stakingTokens.map(({ address, name, symbol }) => {
                                return (
                                    <TokenChip
                                        key={address}
                                        name={name}
                                        symbol={symbol}
                                        address={address}
                                        chainId={chainId}
                                        onRemove={getRemoveStakingTokenHandler(
                                            address,
                                        )}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
