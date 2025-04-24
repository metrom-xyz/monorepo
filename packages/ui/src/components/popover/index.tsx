import { forwardRef, type ReactElement, type ReactNode, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";
import {
    autoUpdate,
    flip,
    offset,
    useFloating,
    type Placement,
} from "@floating-ui/react";

import styles from "./styles.module.css";

export interface PopoverProps {
    open: boolean;
    anchor?: Element | null;
    margin?: number;
    placement?: Placement;
    className?: string;
    children?: ReactNode;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    function Popover(
        { open, anchor, margin, placement, className, children }: PopoverProps,
        ref,
    ): ReactElement {
        const [popper, setPopper] = useState<HTMLDivElement | null>(null);

        const { floatingStyles } = useFloating({
            elements: { reference: anchor, floating: popper },
            open,
            middleware: [
                offset(margin || 8),
                flip({ fallbackPlacements: ["top", "bottom"] }),
            ],
            placement,
            whileElementsMounted: autoUpdate,
        });

        return (
            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={(element) => {
                            if (ref) {
                                if (typeof ref === "function") ref(element);
                                else ref.current = element;
                            }
                            setPopper(element);
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ ...floatingStyles }}
                        className={classNames(styles.root, className)}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    },
);
