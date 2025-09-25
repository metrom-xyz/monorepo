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
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    function handlePopoverOpen() {
        setPopover(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    function handlePopoverClose() {
        if (trigger === "hover")
            timeoutRef.current = setTimeout(() => {
                setPopover(false);
            }, 100);
        else setPopover(false);
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
            {...(trigger === "click"
                ? { onClick: handlePopoverToggle }
                : {
                      onMouseEnter: handlePopoverOpen,
                      onMouseLeave: handlePopoverClose,
                  })}
            className={classNames("root", styles.root, className)}
        >
            <div ref={setAnchor}>
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
            </div>
            <div className={classNames("iconWrapper", styles.iconWrapper)}>
                {icon ? (
                    icon
                ) : (
                    <Info className={classNames("icon", styles.icon)} />
                )}
            </div>
        </div>
    );
}
