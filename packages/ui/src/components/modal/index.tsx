import { type ReactNode, useEffect, useRef } from "react";
import { useTransition, animated } from "@react-spring/web";

import styles from "./styles.module.css";

interface ModalProps {
    open?: boolean;
    onDismiss?: () => void;
    children?: ReactNode;
}

export function Modal({ open, onDismiss, children, ...rest }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    const transition = useTransition(open, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 200 },
    });

    useEffect(() => {
        if (!open || !onDismiss) return;
        const handleCloseOnClick = (event: MouseEvent) => {
            if (
                event.button === 0 && // don't close the modal on double clicks
                !!overlayRef.current &&
                overlayRef.current.isSameNode(event.target as Node)
            )
                onDismiss();
        };
        const handleCloseOnKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onDismiss();
        };
        document.addEventListener("mousedown", handleCloseOnClick);
        document.addEventListener("keydown", handleCloseOnKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleCloseOnClick);
            document.removeEventListener("keydown", handleCloseOnKeyDown);
        };
    }, [onDismiss, open]);

    return transition(
        (style, modalOpen) =>
            modalOpen && (
                <animated.div
                    style={style}
                    className={`root ${styles.root}`}
                    ref={overlayRef}
                    {...rest}
                >
                    {children}
                </animated.div>
            ),
    );
}
