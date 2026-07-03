import { ChainType } from "@metrom-xyz/sdk";
import type { SVGIcon } from "@/src/types/common";
import {
    startTransition,
    useCallback,
    useRef,
    useState,
    type FunctionComponent,
} from "react";
import { AptosLogo, EthLogo, SolanaLogo, SuiLogo } from "@metrom-xyz/chains";
import { Popover, Typography } from "@metrom-xyz/ui";
import { useChainType } from "@/src/hooks/useChainType";
import { usePathname, useRouter } from "@/src/i18n/routing";
import classNames from "classnames";

import styles from "./styles.module.css";

const ECOSYSTEMS: {
    name: string;
    type: ChainType;
    icon: FunctionComponent<SVGIcon>;
}[] = [
    {
        name: "EVM",
        type: ChainType.Evm,
        icon: EthLogo,
    },
    {
        name: "Aptos",
        type: ChainType.Aptos,
        icon: AptosLogo,
    },
    {
        name: "Solana",
        type: ChainType.Svm,
        icon: SolanaLogo,
    },
    {
        name: "Sui",
        type: ChainType.Sui,
        icon: SuiLogo,
    },
];

export function EcosystemPicker() {
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    const { chainType, setChainType } = useChainType();
    const pathname = usePathname();
    const router = useRouter();
    const popoverRef = useRef<HTMLDivElement>(null);

    function handlePopoverOnOpen() {
        setOpen(true);
    }

    const getOnChangeHandler = useCallback(
        (type: ChainType) => {
            return () => {
                if (pathname.startsWith("/campaigns/create")) {
                    router.replace("/campaigns/create");
                    startTransition(() => setChainType(type));
                } else {
                    setChainType(type);
                }
                setOpen(false);
            };
        },
        [setChainType, pathname, router],
    );

    const selected = ECOSYSTEMS.find(({ type }) => type === chainType);

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
                {ECOSYSTEMS.map(({ name, type, icon: Icon }) => {
                    return (
                        <button
                            key={name}
                            onClick={getOnChangeHandler(type)}
                            className={classNames(styles.button, {
                                [styles.active]: type === chainType,
                            })}
                        >
                            <Icon className={styles.logo} />
                            <Typography weight="medium">{name}</Typography>
                        </button>
                    );
                })}
            </Popover>
            <div
                ref={setAnchor}
                onClick={handlePopoverOnOpen}
                className={styles.trigger}
            >
                {selected && (
                    <>
                        <selected.icon className={styles.logo} />
                        <Typography weight="medium">
                            {selected?.name}
                        </Typography>
                    </>
                )}
            </div>
        </div>
    );
}
