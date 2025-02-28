import {
    forwardRef,
    type ReactElement,
    type ReactNode,
    useState,
    useEffect,
} from "react";
import { usePopper } from "react-popper";
import { type Placement } from "@popperjs/core";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";

import styles from "./styles.module.css";

export interface PopoverProps {
    open: boolean;
    anchor?: Element | null;
    placement?: Placement;
    offset?: [number, number];
    className?: string;
    children?: ReactNode;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
    function Popover(
        {
            open,
            anchor,
            placement = "auto",
            offset = [0, 8],
            className,
            children,
        },
        ref,
    ): ReactElement {
        const [popper, setPopper] = useState<HTMLDivElement | null>(null);

        const {
            styles: popperStyles,
            attributes,
            update,
        } = usePopper(anchor, popper, {
            placement,
            modifiers: [
                {
                    name: "offset",
                    options: { offset },
                },
            ],
        });

        useEffect(() => {
            if (open && update) update();
        }, [open, update]);

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
                        initial="hide"
                        animate="show"
                        exit="hide"
                        variants={{
                            hide: { opacity: 0 },
                            show: { opacity: 1 },
                        }}
                        transition={{ duration: 0.2 }}
                        style={{ ...popperStyles.popper }}
                        className={classNames(styles.root, className)}
                        {...attributes.popper}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    },
);
