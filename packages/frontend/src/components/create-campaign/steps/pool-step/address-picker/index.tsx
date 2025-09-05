import { useTranslations } from "next-intl";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
} from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { usePool } from "@/src/hooks/usePool";
import type { AmmPoolLiquidityCampaignPayload } from "@/src/types/campaign";
import { type Address, type Hex, isHash } from "viem";
import { useDebounce } from "react-use";
import { TextInput, Typography } from "@metrom-xyz/ui";
import { SearchIcon } from "@/src/assets/search-icon";
import { Pool, SkeletonPool } from "../pool";
import type { AmmPoolWithTvl } from "@metrom-xyz/sdk";
import { CHAIN_TYPE } from "@/src/commons";
import { isAddress } from "@/src/utils/address";

import styles from "./styles.module.css";

export interface AddressPoolPickerProps {
    dex?: AmmPoolLiquidityCampaignPayload["dex"];
    onChange: (pool: AmmPoolWithTvl) => void;
    onError: (error: string) => void;
}

export function AddressPoolPicker({
    dex,
    onChange,
    onError,
}: AddressPoolPickerProps) {
    const t = useTranslations("newCampaign.form.ammPoolLiquidity.pool");
    const [search, setSearch] = useState("");
    const [id, setId] = useState<Address | Hex>();
    const { id: chainId } = useChainWithType();

    const { pool: importedPool, loading: loadingImportedPool } = usePool({
        chainId,
        chainType: CHAIN_TYPE,
        id,
    });

    const addressOrId = useMemo(() => {
        return !!isAddress(search) || !!isHash(search);
    }, [search]);

    useDebounce(
        () => {
            setId(addressOrId ? (search as Address) : undefined);
        },
        300,
        [addressOrId, search],
    );

    useEffect(() => {
        if (search && !addressOrId) onError(t("errors.invalidAddress"));
        else if (id && !loadingImportedPool && importedPool === null)
            onError(t("errors.invalidPool"));
        else if (dex && importedPool && importedPool.dex.slug !== dex.slug)
            onError(t("errors.inconsistentDex", { dex: dex.name }));
        else onError("");
    }, [
        id,
        dex,
        addressOrId,
        loadingImportedPool,
        importedPool,
        search,
        t,
        onError,
    ]);

    const handlePoolOnChange = useCallback(() => {
        if (!importedPool) return;
        onChange(importedPool);
        setSearch("");
    }, [importedPool, onChange]);

    function handleSearchOnChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    const empty = !loadingImportedPool && !importedPool;
    const validPool = !empty && dex && importedPool?.dex.slug === dex?.slug;
    const invalidPool =
        id &&
        !loadingImportedPool &&
        (importedPool === null || (dex && importedPool?.dex.slug !== dex.slug));

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <TextInput
                    error={!!search && !addressOrId}
                    value={search}
                    onChange={handleSearchOnChange}
                    placeholder={t("label")}
                    icon={SearchIcon}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.wrapper}>
                {loadingImportedPool && !importedPool && <SkeletonPool />}

                {search && !id && (
                    <Typography uppercase size="xs" weight="medium">
                        {t("errors.enterValidAddress")}
                    </Typography>
                )}

                {invalidPool && (
                    <Typography uppercase size="xs" weight="medium">
                        {t("errors.poolNotSupported")}
                    </Typography>
                )}

                {!search && empty && (
                    <Typography uppercase size="xs" weight="medium">
                        {t("empty")}
                    </Typography>
                )}

                {validPool && (
                    <Pool
                        chain={chainId}
                        pool={importedPool}
                        onClick={handlePoolOnChange}
                    />
                )}
            </div>
        </div>
    );
}
