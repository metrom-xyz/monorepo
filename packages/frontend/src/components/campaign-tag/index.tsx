import { Typography, type TypographySize } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface CampaignTagProps {
    text: string;
    size?: TypographySize;
}

export function CampaignTag({ text, size = "xs" }: CampaignTagProps) {
    return (
        <div className={styles.root}>
            <Typography size={size} weight="medium" uppercase>
                {text}
            </Typography>
        </div>
    );
}
