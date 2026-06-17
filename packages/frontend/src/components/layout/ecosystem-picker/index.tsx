import { ChainType } from "@metrom-xyz/sdk";
import type { SVGIcon } from "@/src/types/common";
import { useRef, useState, type FunctionComponent } from "react";
import {
    BASE_URL,
    METROM_APTOS_BASE_URL,
    METROM_SOLANA_BASE_URL,
    METROM_SUI_BASE_URL,
} from "@/src/commons";
import { AptosLogo, EthLogo, SolanaLogo, SuiLogo } from "@metrom-xyz/chains";
import { Popover, Typography } from "@metrom-xyz/ui";
import { useChainType } from "@/src/hooks/useChainType";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

const ECOSYSTEMS: {
    url: string;
    name: string;
    type: ChainType;
    icon: FunctionComponent<SVGIcon>;
}[] = [
    {
        url: BASE_URL,
        name: "EVM",
        type: ChainType.Evm,
        icon: EthLogo,
    },
    {
        url: METROM_APTOS_BASE_URL,
        name: "Aptos",
        type: ChainType.Aptos,
        icon: AptosLogo,
    },
    {
        url: METROM_SOLANA_BASE_URL,
        name: "Solana",
        type: ChainType.Svm,
        icon: SolanaLogo,
    },
    {
        url: METROM_SUI_BASE_URL,
        name: "Sui",
        type: ChainType.Sui,
        icon: SuiLogo,
    },
];

export function EcosystemPicker() {
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    const t = useTranslations("navigation");
    const chainType = useChainType();
    const popoverRef = useRef<HTMLDivElement>(null);

    function handlePopoverOnOpen() {
        setOpen(true);
    }

    return (
        <div className={styles.root}>
            <Popover
                ref={popoverRef}
                placement="bottom-start"
                variant="secondary"
                anchor={anchor}
                open={open}
                margin={4}
                onOpenChange={setOpen}
                className={styles.popover}
            >
                {ECOSYSTEMS.map(({ url, name, type, icon: Icon }) => {
                    if (type === chainType) return null;

                    return (
                        <a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            <Icon className={styles.logo} />
                            <Typography weight="medium">{name}</Typography>
                            <ArrowRightIcon
                                className={styles.externalLinkIcon}
                            />
                        </a>
                    );
                })}
            </Popover>
            <div
                ref={setAnchor}
                onClick={handlePopoverOnOpen}
                className={styles.trigger}
            >
                <Typography weight="medium">{t("ecosystem")}</Typography>
            </div>
        </div>
    );
}
