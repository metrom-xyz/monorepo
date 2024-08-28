import styles from "./styles.module.css";
import classNames from "@/src/utils/classes";
import { useTranslations } from "next-intl";
import { useClickAway } from "react-use";
import { useRef } from "react";

interface AccountMenuProps {
    className?: string;
    account: {
        address: string;
        balanceDecimals?: number;
        balanceFormatted?: string;
        balanceSymbol?: string;
        displayBalance?: string;
        displayName: string;
        ensAvatar?: string;
        ensName?: string;
        hasPendingTransactions: boolean;
    };
    blockie: string;
    onClose: () => void;
}

// TODO: finish this
export function AccountMenu({ className, onClose }: AccountMenuProps) {
    const t = useTranslations("navigation.accountMenu");
    const rootRef = useRef(null);

    useClickAway(rootRef, onClose);

    return (
        <div className={classNames(styles.root, className)} ref={rootRef}></div>
    );
}
