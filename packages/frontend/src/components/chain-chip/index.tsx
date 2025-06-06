import { useChainData } from "@/src/hooks/useChainData";
import { Chip, Typography, type TypographySize } from "@metrom-xyz/ui";

import styles from "./styles.module.css";
import classNames from "classnames";

interface ChainChipProps {
    id: number;
    size?: TypographySize;
}

export function ChainChip({ id, size = "xs" }: ChainChipProps) {
    const chainData = useChainData(id);

    return (
        <Chip
            variant="secondary"
            border="squared"
            className={{ root: styles.root }}
        >
            {chainData?.icon && (
                <chainData.icon
                    className={classNames(styles.icon, {
                        [styles[size]]: true,
                    })}
                />
            )}
            <Typography size={size} uppercase>
                {chainData?.name}
            </Typography>
        </Chip>
    );
}
