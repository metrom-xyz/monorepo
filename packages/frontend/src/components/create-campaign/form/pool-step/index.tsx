import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type {
    CampaignPayload,
    CampaignPayloadErrors,
    CampaignPayloadPart,
} from "@/src/types";
import { ErrorText, TextInput, Typography } from "@metrom-xyz/ui";
import { PoolStepPreview } from "./preview";
import classNames from "classnames";
import { type Address, isAddress } from "viem";
import { useDebounce } from "react-use";

import styles from "./styles.module.css";
import { usePool } from "@/src/hooks/usePool";
import { SearchIcon } from "@/src/assets/search-icon";
import { Pool, SkeletonPool } from "./pool";

interface PoolStepProps {
    disabled?: boolean;
    dex?: CampaignPayload["dex"];
    pool?: CampaignPayload["pool"];
    onPoolChange: (pool: CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function PoolStep({
    disabled,
    pool,
    dex,
    onPoolChange,
    onError,
}: PoolStepProps) {
    const t = useTranslations("newCampaign.form.pool");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [address, setAddress] = useState<Address>();
    const chainId = useChainId();

    const { pool: importedPool, loading: loadingImportedPool } = usePool(
        chainId,
        address,
    );

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled || !!pool) return;
        setOpen(true);
    }, [pool, disabled]);

    useDebounce(
        () => {
            setAddress(isAddress(search) ? search : undefined);
        },
        300,
        [search],
    );

    useEffect(() => {
        if (search && !address) setError("errors.invalidAddress");
        else if (address && !loadingImportedPool && importedPool === null)
            setError("errors.invalidPool");
        else if (dex && pool && pool.dex !== dex.slug)
            setError(t("errors.inconsistentDex", { dex: dex.name }));
        else setError("");
    }, [address, dex, pool, loadingImportedPool, importedPool, search, t]);

    useEffect(() => {
        onError({ pool: !!error });
    }, [onError, error]);

    const handlePoolOnChange = useCallback(() => {
        if (!importedPool) return;
        if (pool && pool.address === importedPool.address) return;
        onPoolChange({ pool: importedPool });
        setSearch("");
        setOpen(false);
    }, [importedPool, pool, onPoolChange]);

    function handleStepOnClick() {
        setOpen((open) => !open);
    }

    function handleSearchOnChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!pool}
            onPreviewClick={handleStepOnClick}
            error={!!error}
        >
            <StepPreview
                label={
                    !pool ? (
                        <div className={styles.previewLabelWrapper}>
                            <div className={styles.previewTextWrapper}>
                                <Typography
                                    uppercase
                                    weight="medium"
                                    className={styles.previewLabel}
                                >
                                    {t("title")}
                                </Typography>
                                {!!error && (
                                    <ErrorText
                                        size="xs"
                                        weight="medium"
                                        level="error"
                                        className={classNames(styles.error, {
                                            [styles.errorVisible]: !!error,
                                        })}
                                    >
                                        {!!error ? t(error) : null}
                                    </ErrorText>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.previewCompletedLabel}>
                            <Typography
                                uppercase
                                weight="medium"
                                className={styles.previewLabel}
                            >
                                {t("preview.pool")}
                            </Typography>
                            <Typography
                                uppercase
                                weight="medium"
                                className={styles.previewLabel}
                            >
                                {t("preview.tvl")}
                            </Typography>
                        </div>
                    )
                }
            >
                {pool && <PoolStepPreview {...pool} />}
            </StepPreview>
            <StepContent>
                <div className={styles.root}>
                    <div className={styles.header}>
                        <TextInput
                            value={search}
                            onChange={handleSearchOnChange}
                            placeholder={t("label")}
                            icon={SearchIcon}
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.wrapper}>
                        {!loadingImportedPool && !importedPool && (
                            <Typography>{t("empty")}</Typography>
                        )}
                        {loadingImportedPool && <SkeletonPool />}
                        {importedPool && (
                            <Pool
                                chain={chainId}
                                pool={importedPool}
                                onClick={handlePoolOnChange}
                            />
                        )}
                    </div>
                </div>
            </StepContent>
        </Step>
    );
}
