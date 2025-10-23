import { ChevronLeft } from "../..//assets/chevron-left";
import { ChevronRight } from "../..//assets/chevron-right";
import classNames from "classnames";
import { useMemo } from "react";
import { Typography } from "../typography";
import { Button } from "../button";

import styles from "./styles.module.css";

const PAGES_THRESHOLD = 3;

export interface PaginationProps {
    page: number;
    totalPages: number;
    loading?: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onPage: (number: number) => void;
}

export function Pagination({
    page,
    totalPages,
    loading,
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
            <Button
                variant="secondary"
                size="xs"
                disabled={page === 1 || loading}
                onClick={onPrevious}
                className={{
                    root: classNames(styles.button, {
                        [styles.loading]: loading,
                    }),
                }}
            >
                <ChevronLeft className={styles.arrowIcon} />
            </Button>
            {pages.map((number, i) => {
                const disabled = page === number;

                if (number < 0)
                    return (
                        <Typography key={i} className={styles.ellipsis}>
                            ...
                        </Typography>
                    );
                return (
                    <Button
                        key={i}
                        variant="secondary"
                        size="xs"
                        border={false}
                        disabled={disabled || loading}
                        onClick={() => onPage(number)}
                        className={{
                            root: classNames(styles.button, {
                                [styles.active]: disabled,
                                [styles.loading]: loading,
                            }),
                        }}
                    >
                        <Typography>{number}</Typography>
                    </Button>
                );
            })}
            <Button
                variant="secondary"
                size="xs"
                disabled={page === totalPages || loading}
                onClick={onNext}
                className={{
                    root: classNames(styles.button, {
                        [styles.loading]: loading,
                    }),
                }}
            >
                <ChevronRight className={styles.arrowIcon} />
            </Button>
        </div>
    );
}
