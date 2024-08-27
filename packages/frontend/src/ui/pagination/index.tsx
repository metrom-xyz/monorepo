import { ChevronLeft } from "@/src/assets/chevron-left";
import { ChevronRight } from "@/src/assets/chevron-right";
import classNames from "@/src/utils/classes";

import styles from "./styles.module.css";

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
    return (
        <div className={styles.root}>
            <button
                className={classNames(
                    styles.item,
                    styles.arrowItem,
                    styles.arrow,
                )}
                onClick={onPrevious}
                disabled={page === 1}
            >
                <ChevronLeft className={styles.arrowIcon} />
            </button>
            {new Array(totalPages).fill(null).map((_, i) => {
                const number = i + 1;
                const disabled = page === number;
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
                        {number}
                    </button>
                );
            })}
            <button
                className={classNames(
                    styles.item,
                    styles.arrowItem,
                    styles.arrow,
                )}
                onClick={onNext}
                disabled={page === totalPages}
            >
                <ChevronRight className={styles.arrowIcon} />
            </button>
        </div>
    );
}
