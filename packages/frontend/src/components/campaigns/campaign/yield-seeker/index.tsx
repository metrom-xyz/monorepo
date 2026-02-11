import type { Campaign } from "@/src/types/campaign";
import { Button, Card, Modal, Popover, Typography, X } from "@metrom-xyz/ui";
import { Chain } from "../chain";
import { Protocol } from "../protocol";
import { Action } from "../action";
import { Status } from "../status";
import { BackendCampaignType } from "@metrom-xyz/sdk";
import { Apr } from "../apr";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { useEffect, useRef, useState } from "react";
import { YieldSeekerLogo } from "@/src/assets/logos/protocols/yield-seeker";
import { useTranslations } from "next-intl";
import {
    YIELDSEEKER_APP_BASE_URL,
    YIELDSEEKER_BONUS_PERCENTAGE,
    YIELDSEEKER_REFERRAL_CODE,
} from "@/src/commons";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { BoldText } from "@/src/components/bold-text";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface YieldSeekerProps {
    type: BackendCampaignType;
    campaign: Campaign;
}

export function YieldSeeker({ type, campaign }: YieldSeekerProps) {
    const t = useTranslations("allCampaigns.yieldSeeker");

    const [modal, setModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!copied) return;
        const timeout = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timeout);
    }, [copied]);

    function handleModalOnOpen() {
        setModal(true);
    }

    function handleModalOnClose() {
        setModal(false);
    }

    function handleInfoPopoverOpen() {
        setPopover(true);
    }

    function handleInfoPopoverClose() {
        setPopover(false);
    }

    function handleCopyOnClick() {
        navigator.clipboard.writeText(YIELDSEEKER_REFERRAL_CODE).then(() => {
            setCopied(true);
        });
    }

    return (
        <>
            <div className={commonStyles.root} onClick={handleModalOnOpen}>
                <Card className={commonStyles.card}>
                    <Chain id={campaign.chainId} type={campaign.chainType} />
                    <Protocol campaign={campaign} />
                    <div className={commonStyles.action}>
                        <Action campaign={campaign} />
                    </div>
                    <Status
                        from={campaign.from}
                        to={campaign.to}
                        status={campaign.status}
                        showDuration={false}
                    />
                    {type === BackendCampaignType.Rewards && (
                        <Apr
                            campaign={campaign}
                            apr={campaign.apr}
                            kpi={!!campaign.specification?.kpi}
                        />
                    )}
                    <Typography weight="medium">
                        {campaign.usdTvl !== undefined
                            ? formatUsdAmount({ amount: campaign.usdTvl })
                            : "-"}
                    </Typography>
                    <div>-</div>
                </Card>
            </div>
            <Modal onDismiss={handleModalOnClose} open={modal}>
                <div className={styles.modal}>
                    <div className={styles.header}>
                        <X
                            onClick={handleModalOnClose}
                            className={styles.xIcon}
                        />
                        <div className={styles.title}>
                            <YieldSeekerLogo />
                            <Typography
                                size="xs"
                                weight="medium"
                                variant="tertiary"
                                uppercase
                            >
                                {t("partnership")}
                            </Typography>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.bonusBox}>
                            <Typography
                                size="xl2"
                                weight="semibold"
                                uppercase
                                className={styles.greenText}
                            >
                                {t("bonusApr", {
                                    percentage: formatPercentage({
                                        percentage:
                                            YIELDSEEKER_BONUS_PERCENTAGE,
                                    }),
                                })}
                            </Typography>
                            <Popover
                                ref={popoverRef}
                                open={popover}
                                anchor={anchor}
                                onOpenChange={setPopover}
                                placement="top"
                            >
                                <Typography weight="medium" size="xs">
                                    {copied ? t("copied") : t("tooltip")}
                                </Typography>
                            </Popover>
                            <div className={styles.bonusCodeWrapper}>
                                <Typography size="sm" uppercase>
                                    {t("bonusCode")}
                                </Typography>
                                <Typography
                                    ref={setAnchor}
                                    onMouseEnter={handleInfoPopoverOpen}
                                    onMouseLeave={handleInfoPopoverClose}
                                    onClick={handleCopyOnClick}
                                    size="sm"
                                    weight="semibold"
                                    className={styles.bonusCode}
                                >
                                    {YIELDSEEKER_REFERRAL_CODE}
                                </Typography>
                            </div>
                        </div>
                        <div className={styles.howToContainer}>
                            <Typography size="sm" weight="medium" uppercase>
                                {t("howTo")}
                            </Typography>
                            <div className={styles.list}>
                                <div className={styles.step}>
                                    <Typography
                                        size="xs"
                                        className={styles.brandGreenText}
                                    >
                                        1
                                    </Typography>
                                    <div className={styles.stepLinkWrapper}>
                                        <Typography size="sm">
                                            {t("step1")}
                                        </Typography>
                                        <a
                                            href={YIELDSEEKER_APP_BASE_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.link}
                                        >
                                            {YIELDSEEKER_APP_BASE_URL}
                                            <ArrowRightIcon
                                                className={
                                                    styles.externalLinkIcon
                                                }
                                            />
                                        </a>
                                    </div>
                                </div>
                                <div className={styles.step}>
                                    <Typography
                                        size="xs"
                                        className={styles.brandGreenText}
                                    >
                                        2
                                    </Typography>
                                    <Typography size="sm">
                                        {t.rich("step2", {
                                            code: YIELDSEEKER_REFERRAL_CODE,
                                            bold: (chunks) => (
                                                <BoldText>{chunks}</BoldText>
                                            ),
                                        })}
                                    </Typography>
                                </div>
                                <div className={styles.step}>
                                    <Typography
                                        size="xs"
                                        className={styles.brandGreenText}
                                    >
                                        3
                                    </Typography>
                                    <Typography size="sm">
                                        {t("step3")}
                                    </Typography>
                                </div>
                                <div className={styles.step}>
                                    <Typography
                                        size="xs"
                                        className={styles.brandGreenText}
                                    >
                                        4
                                    </Typography>
                                    <Typography size="sm">
                                        {t("step4")}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <Button
                            href={YIELDSEEKER_APP_BASE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            className={{
                                root: styles.button,
                                icon: styles.externalLinkIcon,
                            }}
                        >
                            {t("goTo")}
                        </Button>
                        <Typography
                            size="xs"
                            variant="tertiary"
                            className={styles.description}
                        >
                            {t.rich("description", {
                                code: YIELDSEEKER_REFERRAL_CODE,
                            })}
                        </Typography>
                    </div>
                </div>
            </Modal>
        </>
    );
}
