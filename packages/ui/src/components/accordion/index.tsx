"use client";

import { easings, useSpring, animated, useTransition } from "@react-spring/web";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDown } from "../../assets/chevron-down";
import classNames from "classnames";
import { Typography } from "../typography";

import styles from "./styles.module.css";

export interface AccordionProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export function Accordion({ title, children, className }: AccordionProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [springStyles, springApi] = useSpring(
        () => ({
            height: rootRef.current?.clientHeight || "48px",
        }),
        [],
    );

    const transition = useTransition(open, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 200, easing: easings.easeInOutCubic },
    });

    useEffect(() => {
        springApi.start({
            height:
                (open
                    ? wrapperRef?.current?.offsetHeight
                    : rootRef.current?.offsetHeight) + "px",
            config: { duration: 200, easing: easings.easeInOutCubic },
        });
    }, [springApi, open]);

    function handleOnToggleOpen() {
        setOpen((prevState) => !prevState);
    }

    return (
        <animated.div
            style={springStyles}
            className={classNames("root", styles.rootm, className)}
        >
            <div ref={wrapperRef}>
                <div
                    ref={rootRef}
                    onClick={handleOnToggleOpen}
                    className={classNames("preview", styles.preview, {
                        [styles.open]: open,
                    })}
                >
                    <ChevronDown
                        className={classNames("icon", styles.icon, {
                            [styles.open]: open,
                        })}
                    />
                    <Typography uppercase weight="medium" light>
                        {title}
                    </Typography>
                </div>
                {transition(
                    (style, open) =>
                        open && (
                            <animated.div
                                style={style}
                                className={classNames(
                                    "content",
                                    styles.content,
                                )}
                            >
                                {children}
                            </animated.div>
                        ),
                )}
            </div>
        </animated.div>
    );
}
