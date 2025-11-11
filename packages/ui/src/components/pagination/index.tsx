import classNames from "classnames";
import { useMemo } from "react";
import { Typography } from "../typography";
import { ArrowLeft } from "../../assets/arrow-left";
import { ArrowRight } from "../../assets/arrow-right";

import styles from "./styles.module.css";

const PAGES_THRESHOLD = 1;

export interface PaginationProps {
    page: number;
    totalPages: number;
    loading?: boolean;
    messages: {
        previous: string;
        next: string;
    };
    onPrevious: () => void;
    onNext: () => void;
    onPage: (number: number) => void;
}

export function Pagination({
    page,
    totalPages,
    loading,
    messages,
    onPrevious,
    onNext,
    onPage,
}: PaginationProps) {
    const pages = useMemo(() => {
        const pages = [1];

        const start = Math.max(2, page - Math.floor(PAGES_THRESHOLD / 2));
        const end = Math.min(
            totalPages - 1,
            page + Math.floor(PAGES_THRESHOLD / 2),
        );

        if (start > 2) pages.push(-1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push(-1);
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    }, [page, totalPages]);

    return (
        <div className={styles.root}>
            <div
                className={classNames(styles.button, styles.step, {
                    [styles.disabled]: page === 1 || loading,
                    [styles.loading]: loading,
                })}
                onClick={onPrevious}
            >
                <ArrowLeft className={styles.icon} />
                <Typography size="xs" weight="semibold">
                    {messages.previous}
                </Typography>
            </div>
            {pages.map((number, i) => {
                const active = page === number;

                if (number < 0)
                    return (
                        <Typography
                            key={i}
                            size="xs"
                            weight="semibold"
                            className={classNames(styles.ellipsis, {
                                [styles.disabled]: loading,
                                [styles.loading]: loading,
                            })}
                        >
                            ...
                        </Typography>
                    );
                return (
                    <div
                        key={i}
                        onClick={() => onPage(number)}
                        className={classNames(styles.button, {
                            [styles.active]: active || loading,
                            [styles.loading]: loading,
                            [styles.disabled]: loading,
                        })}
                    >
                        <Typography size="xs" weight="semibold">
                            {number}
                        </Typography>
                    </div>
                );
            })}
            <div
                onClick={onNext}
                className={classNames(styles.button, styles.step, {
                    [styles.disabled]: page === totalPages || loading,
                    [styles.loading]: loading,
                })}
            >
                <Typography size="xs" weight="semibold">
                    {messages.next}
                </Typography>
                <ArrowRight className={styles.icon} />
            </div>
        </div>
    );
}
