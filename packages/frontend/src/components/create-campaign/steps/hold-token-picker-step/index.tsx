import { Step } from "@/src/components/step";
import { StepContent } from "@/src/components/step/content";
import { StepPreview } from "@/src/components/step/preview";
import type {
    CampaignPayloadErrors,
    HoldTokenCampaignPayloadPart,
} from "@/src/types/campaign";
import type { Address } from "viem";
import classNames from "classnames";
import { ErrorText, TextInput, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { InfoMessage } from "@/src/components/info-message";
import { isAddress } from "@/src/utils/address";
import { useTokenInfo } from "@/src/hooks/useTokenInfo";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { TokenChip, TokenChipLoading } from "./token-chip";
import type { LocalizedMessage } from "@/src/types/utils";
import { StakingTokenPicker } from "./staking-token-picker";
import type { TokenInfo } from "@/src/types/common";

import styles from "./styles.module.css";

interface HoldTokenPickerStepProps {
    disabled?: boolean;
    token?: TokenInfo;
    stakingTokens: TokenInfo[];
    onTokensChange: (rewards: HoldTokenCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.holdToken.picker">;

export function HoldTokenPickerStep({
    disabled,
    token,
    stakingTokens,
    onTokensChange,
    onError,
}: HoldTokenPickerStepProps) {
    const t = useTranslations("newCampaign.form.holdToken.picker");

    const [tokenError, setTokenError] = useState<ErrorMessage>("");
    const [stakingTokenError, setStakingTokenError] =
        useState<ErrorMessage>("");
    const [internalTokenAddress, setInternalTokenAddress] = useState(
        token?.address || "",
    );
    const [blurTokenAddress, setBlurTokenAddress] = useState(
        token?.address || "",
    );

    const { id: chainId } = useChainWithType();
    const { info: tokenInfo, loading: loadingTokenInfo } = useTokenInfo({
        address: blurTokenAddress,
        enabled: isAddress(blurTokenAddress),
    });

    useEffect(() => {
        if (!internalTokenAddress) {
            setTokenError("");
            return;
        }

        if (!isAddress(internalTokenAddress))
            setTokenError("errors.notAnAddress");
        else if (tokenInfo === null) setTokenError("errors.notFound");
        else setTokenError("");
    }, [internalTokenAddress, tokenInfo]);

    useEffect(() => {
        onError({
            holdTokens: !!tokenError || !!stakingTokenError,
        });
    }, [onError, tokenError, stakingTokenError]);

    useEffect(() => {
        if (tokenInfo) onTokensChange({ token: tokenInfo });
    }, [internalTokenAddress, tokenInfo, onTokensChange]);

    function handleTokenOnChange(event: ChangeEvent<HTMLInputElement>) {
        const token = event.target.value as Address;
        setInternalTokenAddress(token);
    }

    function handleStakingTokensOnChange(stakingTokens: TokenInfo[]) {
        onTokensChange({ stakingTokens });
    }

    const handleTokenOnBlur = useCallback(() => {
        setBlurTokenAddress(internalTokenAddress);
    }, [internalTokenAddress]);

    const handleTokenOnRemove = useCallback(() => {
        setInternalTokenAddress("");
        setBlurTokenAddress("");
        // Also remove the staking tokens
        onTokensChange({ token: undefined, stakingTokens: [] });
    }, [onTokensChange]);

    return (
        <Step disabled={disabled} completed={true} open className={styles.step}>
            <StepPreview
                label={
                    <div
                        className={classNames(styles.previewLabelWrapper, {
                            [styles.disabled]: disabled,
                        })}
                    >
                        <div className={styles.previewTextWrapper}>
                            <div className={styles.titleWrapper}>
                                <Typography
                                    uppercase
                                    weight="medium"
                                    size="sm"
                                    className={styles.previewLabel}
                                >
                                    {t("title")}
                                </Typography>
                                <ErrorText size="xs" weight="medium">
                                    {tokenError
                                        ? t(tokenError)
                                        : stakingTokenError
                                          ? t(stakingTokenError)
                                          : null}
                                </ErrorText>
                            </div>
                        </div>
                    </div>
                }
                decorator={false}
                className={{ root: !disabled ? styles.stepPreview : "" }}
            >
                <div className={styles.previewWrapper}>
                    <InfoMessage text={t("infoMessage")} />
                    <div className={styles.inputWrapper}>
                        <Typography weight="medium" size="xs" uppercase light>
                            {t("tokenAddressInput.label")}
                        </Typography>
                        {tokenInfo === undefined && loadingTokenInfo ? (
                            <TokenChipLoading />
                        ) : tokenInfo ? (
                            <TokenChip
                                {...tokenInfo}
                                chainId={chainId}
                                onRemove={handleTokenOnRemove}
                            />
                        ) : (
                            <TextInput
                                placeholder={t("tokenAddressInput.placeholder")}
                                value={internalTokenAddress}
                                error={!!tokenError}
                                onBlur={handleTokenOnBlur}
                                onChange={handleTokenOnChange}
                            />
                        )}
                    </div>
                    {tokenInfo && (
                        <StakingTokenPicker
                            chainId={chainId}
                            disabled={!token}
                            stakingTokens={stakingTokens}
                            onChange={handleStakingTokensOnChange}
                            onError={setStakingTokenError}
                        />
                    )}
                </div>
            </StepPreview>
            <StepContent></StepContent>
        </Step>
    );
}
