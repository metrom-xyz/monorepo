import { useRef, useState, type ReactNode } from "react";
import { Popover } from "../popover";
import { Info } from "../../assets/info";
import classNames from "classnames";
import type { Placement } from "@floating-ui/react";
import { useClickAway } from "react-use";

import styles from "./styles.module.css";

export interface InfoTooltipProps {
    trigger?: "hover" | "click";
    placement?: Placement;
    children?: ReactNode;
    icon?: ReactNode;
    className?: string;
}

export function InfoTooltip({
    trigger = "hover",
    placement,
    children,
    icon,
    className,
}: InfoTooltipProps) {
    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    function handlePopoverOpen() {
        setPopover(true);
    }

    function handlePopoverClose() {
        setPopover(false);
    }

    function handlePopoverToggle() {
        setPopover((prev) => !prev);
    }

    useClickAway(rootRef, () => {
        if (trigger !== "click") return;
        handlePopoverClose();
    });

    return (
        <div
            ref={rootRef}
            className={classNames("root", styles.root, className)}
        >
            <Popover
                placement={placement}
                anchor={anchor}
                open={popover}
                ref={popoverRef}
                className={styles.popover}
            >
                <div className={classNames("content", styles.content)}>
                    {children}
                </div>
            </Popover>
            <div
                ref={setAnchor}
                {...(trigger === "click"
                    ? { onClick: handlePopoverToggle }
                    : {
                          onMouseEnter: handlePopoverOpen,
                          onMouseLeave: handlePopoverClose,
                      })}
                className={classNames("iconWrapper", styles.iconWrapper)}
            >
                {icon ? (
                    icon
                ) : (
                    <Info className={classNames("icon", styles.icon)} />
                )}
            </div>
        </div>
    );
}
