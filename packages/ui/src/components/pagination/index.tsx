import { ChevronLeft } from "../..//assets/chevron-left";
import { ChevronRight } from "../..//assets/chevron-right";
import classNames from "classnames";
import { useMemo } from "react";
import { Typography } from "../typography";

import styles from "./styles.module.css";

const PAGES_THRESHOLD = 5;

export interface PaginationProps {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
    onPage: (number: number) => void;
}

export function Pagination({
    page,
    totalPages,
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
            <button
                className={classNames(styles.item, styles.arrowItem)}
                onClick={onPrevious}
                disabled={page === 1}
            >
                <ChevronLeft className={styles.arrowIcon} />
            </button>
            {pages.map((number, i) => {
                const disabled = page === number;

                if (number < 0)
                    return (
                        <Typography key={i} className={styles.ellipsis}>
                            ...
                        </Typography>
                    );
                return (
                    <button
                        key={i}
                        className={classNames(styles.item, {
                            [styles.itemActive]: disabled,
                            [styles.clickable]: !disabled,
                        })}
                        disabled={disabled}
                        onClick={() => onPage(number)}
                    >
                        <Typography>{number}</Typography>
                    </button>
                );
            })}
            <button
                className={classNames(styles.item, styles.arrowItem)}
                onClick={onNext}
                disabled={page === totalPages}
            >
                <ChevronRight className={styles.arrowIcon} />
            </button>
        </div>
    );
}
