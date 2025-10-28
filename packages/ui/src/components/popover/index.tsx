import { forwardRef, type ReactElement, type ReactNode, useState } from "react";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import classNames from "classnames";
import {
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    size,
    useDismiss,
    useFloating,
    useInteractions,
    type Placement,
} from "@floating-ui/react";

import styles from "./styles.module.css";

export interface PopoverProps {
    open: boolean;
    anchor?: Element | null;
    variant?: "primary" | "secondary";
    contained?: boolean;
    margin?: number;
    placement?: Placement;
    className?: string;
    children?: ReactNode;
    root?: HTMLElement | null;
    onOpenChange: (open: boolean) => void;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    function Popover(
        {
            open,
            anchor,
            variant = "primary",
            contained = false,
            margin,
            placement,
            className,
            children,
            root,
            onOpenChange,
        }: PopoverProps,
        ref,
    ): ReactElement {
        const [popper, setPopper] = useState<HTMLDivElement | null>(null);

        const { floatingStyles, context } = useFloating({
            elements: { reference: anchor, floating: popper },
            open,
            onOpenChange,
            middleware: [
                offset(margin || 10),
                contained
                    ? size({
                          apply({ rects, elements }) {
                              Object.assign(elements.floating.style, {
                                  width: `${rects.reference.width}px`,
                              });
                          },
                      })
                    : null,
                flip({
                    fallbackPlacements: ["top", "bottom", "left", "right"],
                }),
            ],
            placement,
            whileElementsMounted: autoUpdate,
        });

        const dismiss = useDismiss(context);
        const { getFloatingProps } = useInteractions([dismiss]);

        return (
            <AnimatePresence>
                {open && (
                    <FloatingPortal root={root}>
                        <motion.div
                            ref={(element) => {
                                if (ref) {
                                    if (typeof ref === "function") ref(element);
                                    else ref.current = element;
                                }
                                setPopper(element);
                            }}
                            {...getFloatingProps()}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: easeInOut }}
                            style={{ ...floatingStyles }}
                            className={classNames(styles.root, className, {
                                [styles[variant]]: true,
                            })}
                        >
                            {children}
                        </motion.div>
                    </FloatingPortal>
                )}
            </AnimatePresence>
        );
    },
);
