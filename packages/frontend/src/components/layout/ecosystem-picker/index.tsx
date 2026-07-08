import { ChainType } from "@metrom-xyz/sdk";
import { useCallback, useRef, useState } from "react";
import { Popover, Typography } from "@metrom-xyz/ui";
import { useChainType } from "@/src/context/chain-type";
import { useSwitchEcosystem } from "@/src/hooks/useSwitchEcosystem";
import { ECOSYSTEMS } from "@/src/commons/ecosystems";
import classNames from "classnames";

import styles from "./styles.module.css";

export function EcosystemPicker() {
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    const { chainType } = useChainType();
    const switchEcosystem = useSwitchEcosystem();
    const popoverRef = useRef<HTMLDivElement>(null);

    function handlePopoverOnOpen() {
        setOpen(true);
    }

    const getOnChangeHandler = useCallback(
        (type: ChainType) => {
            return () => {
                switchEcosystem(type);
                setOpen(false);
            };
        },
        [switchEcosystem],
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
