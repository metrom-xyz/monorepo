import { Step } from "@/src/components/step";
import { StepContent } from "@/src/components/step/content";
import { StepPreview } from "@/src/components/step/preview";
import type {
    CampaignPayloadErrors,
    HoldFungibleAssetCampaignPayloadPart,
} from "@/src/types/campaign";
import type { Address } from "viem";
import classNames from "classnames";
import { ErrorText, TextInput, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { InfoMessage } from "@/src/components/info-message";
import { isAddress } from "@/src/utils/address";
import { useAssetInfo } from "@/src/hooks/useAssetInfo";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { AssetChip, AssetChipLoading } from "./asset-chip";
import type { LocalizedMessage } from "@/src/types/utils";
import { StakingAssetsPicker } from "./staking-assets-picker";
import type { TokenInfo } from "@/src/types/common";

import styles from "./styles.module.css";

interface HoldFungibleAssetPickerStepProps {
    disabled?: boolean;
    asset?: TokenInfo;
    stakingAssets: TokenInfo[];
    onFungibleAssetChange: (fungibleAsset: HoldFungibleAssetCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage =
    LocalizedMessage<"newCampaign.form.holdFungibleAsset.picker">;

export function HoldFungibleAssetPickerStep({
    disabled,
    asset,
    stakingAssets,
    onFungibleAssetChange,
    onError,
}: HoldFungibleAssetPickerStepProps) {
    const t = useTranslations("newCampaign.form.holdFungibleAsset.picker");

    const [assetError, setAssetError] = useState<ErrorMessage>("");
    const [stakingAssetError, setStakingAssetError] =
        useState<ErrorMessage>("");
    const [internalAssetAddress, setInternalAssetAddress] = useState(
        asset?.address || "",
    );
    const [blurAssetAddress, setAssetTokenAddress] = useState(
        asset?.address || "",
    );

    const { id: chainId } = useChainWithType();
    const { info: assetInfo, loading: loadingAssetInfo } = useAssetInfo({
        address: blurAssetAddress,
        enabled: isAddress(blurAssetAddress) && !disabled,
    });

    useEffect(() => {
        if (!internalAssetAddress) {
            setAssetError("");
            return;
        }

        if (!isAddress(internalAssetAddress))
            setAssetError("errors.notAnAddress");
        else if (assetInfo === null) setAssetError("errors.notFound");
        else setAssetError("");
    }, [internalAssetAddress, assetInfo]);

    useEffect(() => {
        onError({
            holdFungibleAsset: !!assetError || !!stakingAssetError,
        });
    }, [onError, assetError, stakingAssetError]);

    useEffect(() => {
        if (assetInfo) onFungibleAssetChange({ asset: assetInfo });
    }, [internalAssetAddress, assetInfo, onFungibleAssetChange]);

    function handleAssetOnChange(event: ChangeEvent<HTMLInputElement>) {
        const address = event.target.value as Address;
        setInternalAssetAddress(address);
    }

    function handleStakingAssetsOnChange(stakingTokens: TokenInfo[]) {
        onFungibleAssetChange({ stakingAssets: stakingTokens });
    }

    const handleAssetOnBlur = useCallback(() => {
        setAssetTokenAddress(internalAssetAddress);
    }, [internalAssetAddress]);

    const handleOnRemove = useCallback(() => {
        setInternalAssetAddress("");
        setAssetTokenAddress("");
        // Also remove the staking tokens
        onFungibleAssetChange({ asset: undefined, stakingAssets: [] });
    }, [onFungibleAssetChange]);

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
                                    {assetError
                                        ? t(assetError)
                                        : stakingAssetError
                                          ? t(stakingAssetError)
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
                        {assetInfo === undefined && loadingAssetInfo ? (
                            <AssetChipLoading />
                        ) : assetInfo ? (
                            <AssetChip
                                {...assetInfo}
                                chainId={chainId}
                                onRemove={handleOnRemove}
                            />
                        ) : (
                            <TextInput
                                placeholder={t("tokenAddressInput.placeholder")}
                                value={internalAssetAddress}
                                error={!!assetError}
                                onBlur={handleAssetOnBlur}
                                onChange={handleAssetOnChange}
                            />
                        )}
                    </div>
                    {assetInfo && (
                        <StakingAssetsPicker
                            chainId={chainId}
                            disabled={!asset}
                            stakingAssets={stakingAssets}
                            onChange={handleStakingAssetsOnChange}
                            onError={setStakingAssetError}
                        />
                    )}
                </div>
            </StepPreview>
            <StepContent></StepContent>
        </Step>
    );
}
