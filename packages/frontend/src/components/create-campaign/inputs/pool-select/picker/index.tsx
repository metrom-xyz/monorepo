import { useTranslations } from "next-intl";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
} from "react";
import { usePool } from "@/src/hooks/usePool";
import { type Address, type Hex, isHash } from "viem";
import { useDebounce } from "react-use";
import { Popover, TextInput, Typography } from "@metrom-xyz/ui";
import { SearchIcon } from "@/src/assets/search-icon";
import type { AmmPool } from "@metrom-xyz/sdk";
import { isAddress } from "@/src/utils/address";
import type { DexProtocol } from "@metrom-xyz/chains";
import { Pool } from "../pool";
import { useChainType } from "@/src/hooks/useChainType";
import { TrashIcon } from "@/src/assets/trash-icon";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import type { FormSteps } from "@/src/context/form-steps";

import styles from "./styles.module.css";

export interface PickerProps {
    disabled?: boolean;
    chainId?: number;
    dex?: DexProtocol;
    pool?: AmmPool;
    onChange: (pool?: AmmPool) => void;
    onError: (errors: FormSteps<string>) => void;
}

export function Picker({
    disabled,
    chainId,
    dex,
    pool,
    onChange,
    onError,
}: PickerProps) {
    const [id, setId] = useState<Address | Hex>();
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [popover, setPopover] = useState(false);
    const [picked, setPicked] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const popoverRef = useRef<HTMLDivElement>(null);

    const t = useTranslations("newCampaign.inputs.poolSelect");
    const chainType = useChainType();
    const { pool: importedPool, loading: loadingImportedPool } = usePool({
        chainId,
        chainType,
        id,
    });

    const addressOrId = !!isAddress(search) || !!isHash(search);

    useDebounce(
        () => {
            setId(addressOrId ? (search as Address) : undefined);
        },
        300,
        [addressOrId, search],
    );

    useEffect(() => {
        setPicked(false);
    }, [importedPool]);

    useEffect(() => {
        let error = "";

        if (search && !addressOrId) error = t("errors.invalidAddress");
        else if (id && !loadingImportedPool && !importedPool)
            error = t("errors.invalidPool");
        else if (dex && importedPool && importedPool.dex.slug !== dex.slug)
            error = t("errors.inconsistentDex", { dex: dex.name });
        else error = "";

        setError(error);
        onError({ basics: error });
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

    const handlePoolOnPick = useCallback(() => {
        setPicked(true);
        setSearch("");
        setPopover(false);
        onChange(importedPool);
    }, [importedPool, onChange]);

    const handlePoolOnRemove = useCallback(() => {
        setSearch("");
        onChange(undefined);
    }, [onChange]);

    function handleSearchOnChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    const empty = !loadingImportedPool && !importedPool;
    const validPool = !empty && dex && importedPool?.dex.slug === dex?.slug;
    const importedPoolName = pool
        ? pool.tokens.map((token) => token.symbol).join(" / ")
        : "";

    // 0xa42c17f94558430cd8f8ef3d924e761084fca6f0

    return (
        <div className={styles.root}>
            <div ref={setAnchor}>
                <TextInput
                    size="lg"
                    label={t("label")}
                    disabled={disabled}
                    error={!!search && !!error}
                    errorText={error}
                    readOnly={!!pool}
                    value={search || importedPoolName}
                    loading={loadingImportedPool && !importedPool}
                    prefixElement={
                        pool && (
                            <PoolRemoteLogo
                                size="xxs"
                                chain={pool.chainId}
                                tokens={pool.tokens.map((token) => ({
                                    address: token.address,
                                    defaultText: token.symbol,
                                }))}
                            />
                        )
                    }
                    noPrefixPadding
                    endAdornment={
                        pool && (
                            <TrashIcon
                                onClick={handlePoolOnRemove}
                                className={styles.trashIcon}
                            />
                        )
                    }
                    onChange={handleSearchOnChange}
                    icon={!pool ? SearchIcon : undefined}
                />
            </div>
            <Popover
                ref={popoverRef}
                contained
                anchor={anchor}
                open={!picked && (!!validPool || popover)}
                onOpenChange={setPopover}
                placement="bottom-start"
                margin={4}
            >
                <div className={styles.popover}>
                    <div className={styles.header}>
                        <Typography
                            size="xs"
                            weight="medium"
                            variant="tertiary"
                            uppercase
                        >
                            {t("label")}
                        </Typography>
                        <Typography
                            size="xs"
                            weight="medium"
                            variant="tertiary"
                            uppercase
                        >
                            {t("tvl")}
                        </Typography>
                    </div>
                    {validPool && (
                        <Pool
                            chainId={importedPool.chainId}
                            label={importedPool.tokens
                                .map((token) => token.symbol)
                                .join(" / ")}
                            tokens={importedPool.tokens}
                            usdTvl={importedPool.usdTvl}
                            fee={importedPool.fee}
                            onClick={handlePoolOnPick}
                        />
                    )}
                </div>
            </Popover>
        </div>
    );
}
