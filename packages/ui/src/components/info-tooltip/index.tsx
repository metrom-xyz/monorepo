import { useRef, useState, type ReactNode } from "react";
import { Popover } from "../popover";
import { Info } from "../../assets/info";
import classNames from "classnames";

import styles from "./styles.module.css";

export interface InfoTooltipProps {
    trigger?: "hover" | "click";
    children?: ReactNode;
    className?: string;
}

export function InfoTooltip({
    trigger = "hover",
    children,
    className,
}: InfoTooltipProps) {
    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    function handlePopoverOpen() {
        setPopover(true);
    }

    function handlePopoverClose() {
        setPopover(false);
    }

    function handlePopoverToggle() {
        setPopover((prev) => !prev);
    }

    return (
        <div className={classNames("root", styles.root, className)}>
            <Popover
                placement="top-start"
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
                <Info className={classNames("icon", styles.icon)} />
            </div>
        </div>
    );
}
