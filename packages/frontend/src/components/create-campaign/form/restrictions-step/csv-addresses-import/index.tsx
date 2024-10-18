import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { isAddress, type Address } from "viem";
import Papa from "papaparse";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { MAXIMUM_RESTRICTIONS } from "..";
import { ImportFail } from "./notifications/import-fail";
import { ImportSuccess } from "./notifications/import-success";

import styles from "./styles.module.css";

interface CsvAddressesImportProps {
    onImport: (value: Address[]) => void;
    className?: string;
}

export function CsvAddressesImport({
    onImport,
    className,
}: CsvAddressesImportProps) {
    const t = useTranslations("newCampaign.form.restrictions.import");
    const [csv, setCsv] = useState<File | null>(null);
    const [addresses, setAddresses] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!csv) return;

        Papa.parse(csv, {
            skipEmptyLines: true,
            complete: (result) => {
                const addresses = result.data.flat() as string[];
                setAddresses(addresses);
            },
            error: (error) => {
                console.error("Error parsing csv: ", error);
            },
        });
    }, [csv]);

    useEffect(() => {
        if (addresses.length === 0 || !csv) return;

        setCsv(null);
        setAddresses([]);

        if (addresses.some((address) => !isAddress(address))) {
            toast.custom((toastId) => (
                <ImportFail
                    toastId={toastId}
                    message={t("notification.fail.malformed")}
                />
            ));
            return;
        }
        if (new Set(addresses).size !== addresses.length) {
            toast.custom((toastId) => (
                <ImportFail
                    toastId={toastId}
                    message={t("notification.fail.duplicated")}
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
    }, [csv, addresses, onImport, t]);

    function handleInputOnClick() {
        inputRef.current?.click();
    }

    function handleInputOnChange({
        target: { files },
    }: ChangeEvent<HTMLInputElement>) {
        if (files && files[0]) setCsv(files[0]);
    }

    return (
        <div
            onClick={handleInputOnClick}
            className={classNames(styles.root, className)}
        >
            <Typography weight="medium" variant="sm">
                {t("label")}
            </Typography>
            <input
                ref={inputRef}
                accept=".csv"
                type="file"
                onChange={handleInputOnChange}
                className={classNames(styles.input)}
            />
        </div>
    );
}
