import { Typography, type TypographySize } from "@metrom-xyz/ui";
import classNames from "classnames";

import styles from "./styles.module.css";

interface CampaignTagProps {
    text: string;
    size?: TypographySize;
    className?: string;
}

export function CampaignTag({
    text,
    size = "xs",
    className,
}: CampaignTagProps) {
    return (
        <div className={classNames(styles.root, className)}>
            <Typography size={size} weight="medium" uppercase>
                {text}
            </Typography>
        </div>
    );
}
