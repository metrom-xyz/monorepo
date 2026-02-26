import type { LocalizedMessage } from "@/src/types/utils";
import { Button, TextInput, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { type Address } from "viem";
import { isAddress } from "@/src/utils/address";
import { useFungibleAssetInfo } from "@/src/hooks/useFungibleAssetInfo";
import { AssetChip, AssetChipLoading } from "../asset-chip";
import { useDebounce } from "react-use";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import type { FungibleAssetInfo } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

type ErrorMessage =
    LocalizedMessage<"newCampaign.form.holdFungibleAsset.picker">;

interface StakingAssetsPickerProps {
    visible?: boolean;
    disabled?: boolean;
    chainId: number;
    stakingAssets: FungibleAssetInfo[];
    onChange: (stakingAssets: FungibleAssetInfo[]) => void;
    onError: (error: ErrorMessage) => void;
}

export const MAXIMUM_STAKING_ASSETS = 5;

export function StakingAssetsPicker({
    visible,
    disabled,
    chainId,
    stakingAssets,
    onChange,
    onError,
}: StakingAssetsPickerProps) {
    const t = useTranslations("newCampaign.form.holdFungibleAsset.picker");

    const [assetAddress, setAssetAddress] = useState("");
    const [debouncedAssetAddress, setDebouncedAssetAddress] = useState("");
    const [error, setError] = useState<ErrorMessage>("");

    const {
        info: assetInfo,
        errored: assetInfoErrored,
        loading: loadingAssetInfo,
    } = useFungibleAssetInfo({
        address: debouncedAssetAddress,
        enabled: isAddress(debouncedAssetAddress) && !disabled,
    });

    useDebounce(
        () => {
            setDebouncedAssetAddress(assetAddress);
        },
        300,
        [assetAddress],
    );

    useEffect(() => {
        if (!assetAddress) {
            setError("");
            onError("");
            return;
        }

        let error: ErrorMessage = "";
        if (!isAddress(assetAddress)) error = "errors.notAnAddress";
        else if (
            stakingAssets.find(
                (stakingAsset) => stakingAsset.address === assetInfo?.address,
            )
        )
            error = "errors.alreadyAdded";
        else if (assetInfoErrored) error = "errors.notFound";
        else error = "";

        setError(error);
        onError(error);
    }, [assetAddress, assetInfo, stakingAssets, assetInfoErrored, onError]);

    function handleTokenOnChange(event: ChangeEvent<HTMLInputElement>) {
        const address = event.target.value as Address;
        setAssetAddress(address);
    }

    const handleOnAdd = useCallback(() => {
        if (!assetInfo) return;

        setAssetAddress("");
        setDebouncedAssetAddress("");
        onChange([...stakingAssets, assetInfo]);
    }, [stakingAssets, assetInfo, onChange]);

    function handleClearAsset() {
        setAssetAddress("");
        setDebouncedAssetAddress("");
    }

    const getRemoveAssetHandler = useCallback(
        (toRemove: Address) => {
            return () => {
                onChange(
                    stakingAssets.filter(
                        (stakingAsset) => stakingAsset.address !== toRemove,
                    ),
                );
            };
        },
        [stakingAssets, onChange],
    );

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial="hide"
                    animate="show"
                    exit="hide"
                    variants={{
                        hide: { height: 0 },
                        show: { height: "auto" },
                    }}
                    transition={{ ease: easeInOut, duration: 0.2 }}
                    className={styles.root}
                >
                    <div className={styles.inputWrapper}>
                        <Typography
                            weight="medium"
                            size="xs"
                            uppercase
                            variant="tertiary"
                        >
                            {t("stakingTokenAddressInput.label")}
                        </Typography>
                        {!assetInfo && loadingAssetInfo ? (
                            <AssetChipLoading />
                        ) : assetInfo ? (
                            <AssetChip
                                {...assetInfo}
                                error={!!error}
                                chainId={chainId}
                                onRemove={handleClearAsset}
                            />
                        ) : (
                            <TextInput
                                autoFocus
                                value={assetAddress}
                                disabled={disabled}
                                error={!!error}
                                onChange={handleTokenOnChange}
                                className={styles.assetInput}
                            />
                        )}
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        loading={loadingAssetInfo}
                        disabled={
                            disabled ||
                            !!error ||
                            !assetAddress ||
                            !assetInfo ||
                            loadingAssetInfo ||
                            stakingAssets.length >= MAXIMUM_STAKING_ASSETS
                        }
                        onClick={handleOnAdd}
                        className={{ root: styles.addButton }}
                    >
                        {stakingAssets.length >= MAXIMUM_STAKING_ASSETS
                            ? t("maxTokensLimit")
                            : t("add")}
                    </Button>
                    {stakingAssets.length > 0 && (
                        <>
                            <div className={styles.divider}></div>
                            <div className={styles.listWrapper}>
                                <Typography
                                    weight="medium"
                                    variant="tertiary"
                                    size="xs"
                                    uppercase
                                >
                                    {t("stakingTokens")}
                                </Typography>
                                <div className={styles.list}>
                                    {stakingAssets.map(
                                        ({ address, name, symbol }) => {
                                            return (
                                                <AssetChip
                                                    key={address}
                                                    name={name}
                                                    symbol={symbol}
                                                    address={address}
                                                    chainId={chainId}
                                                    onRemove={getRemoveAssetHandler(
                                                        address,
                                                    )}
                                                />
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
