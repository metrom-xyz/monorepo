import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface CampaignTagProps {
    text: string;
}

export function CampaignTag({ text }: CampaignTagProps) {
    return (
        <div className={styles.root}>
            <Typography size="xs" weight="medium" uppercase>
                {text}
            </Typography>
        </div>
    );
}
