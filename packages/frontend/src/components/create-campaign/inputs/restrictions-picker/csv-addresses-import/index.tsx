import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import { useRef, type ChangeEvent } from "react";
import { type Address } from "viem";
import Papa from "papaparse";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { MAXIMUM_RESTRICTIONS } from "..";
import { ImportFail } from "./notifications/import-fail";
import { ImportSuccess } from "./notifications/import-success";
import { isAddress } from "@/src/utils/address";
import { PlusIcon } from "@/src/assets/plus-icon";

import styles from "./styles.module.css";

interface CsvAddressesImportProps {
    onImport: (value: Address[]) => void;
    className?: string;
}

export function CsvAddressesImport({
    onImport,
    className,
}: CsvAddressesImportProps) {
    const t = useTranslations("newCampaign.form.base.restrictions.import");
    const inputRef = useRef<HTMLInputElement>(null);

    function handleInputOnClick() {
        inputRef.current?.click();
    }

    function handleInputOnChange({
        target: { files },
    }: ChangeEvent<HTMLInputElement>) {
        const csv = files && files[0];
        if (inputRef.current) inputRef.current.value = "";
        if (!csv) return;

        Papa.parse(csv, {
            skipEmptyLines: true,
            complete: (result) => {
                const rawAddresses = result.data
                    .flat()
                    .filter((data) => !!data) as string[];
                const addresses = Array.from(new Set(rawAddresses));

                if (addresses.length === 0) return;

                if (addresses.some((address) => !isAddress(address))) {
                    toast.custom((toastId) => (
                        <ImportFail
                            toastId={toastId}
                            message={t("notification.fail.malformed")}
                        />
                    ));
                    return;
                }
                if (addresses.length > MAXIMUM_RESTRICTIONS) {
                    toast.custom((toastId) => (
                        <ImportFail
                            toastId={toastId}
                            message={t("notification.fail.tooMany", {
                                max: MAXIMUM_RESTRICTIONS,
                            })}
                        />
                    ));
                    return;
                }

                toast.custom((toastId) => (
                    <ImportSuccess
                        toastId={toastId}
                        message={t("notification.success.message")}
                    />
                ));

                onImport(addresses as Address[]);
            },
            error: (error) => {
                console.error("Error parsing csv: ", error);
            },
        });
    }

    return (
        <div
            onClick={handleInputOnClick}
            className={classNames(styles.root, className)}
        >
            <Typography weight="semibold" size="xs" className={styles.label}>
                {t("label")}
            </Typography>
            <PlusIcon />
            <input
                ref={inputRef}
                accept=".csv"
                type="file"
                onChange={handleInputOnChange}
                className={styles.input}
            />
        </div>
    );
}
