import { Popover, Skeleton, Typography } from "@metrom-xyz/ui";
import { useRef, useState } from "react";
import type { TargetedCampaign, TargetType } from "@metrom-xyz/sdk";
import { useLiquityV2BrandsInChain } from "@/src/hooks/useLiquityV2PlatformsInChain";

import styles from "./styles.module.css";

interface BrandProps {
    campaign: TargetedCampaign<TargetType.LiquityV2Debt>;
}

export function Brand({ campaign }: BrandProps) {
    const brands = useLiquityV2BrandsInChain(campaign.chainId);

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [brandDetails, setBrandDetails] = useState<HTMLDivElement | null>(
        null,
    );
    const brandDetailsPopoverRef = useRef<HTMLDivElement>(null);

    const brand = brands.find(
        (brand) => brand.slug === campaign.target.liquityV2Brand.name,
    );
    const BrandLogo = brand?.logo;

    function handleBrandDetailsPopoverOpen() {
        setPopoverOpen(true);
    }

    function handleBrandDetailsPopoverClose() {
        setPopoverOpen(false);
    }

    if (!BrandLogo) return "-";

    return (
        <div className={styles.root}>
            <Popover
                open={popoverOpen}
                anchor={brandDetails}
                ref={brandDetailsPopoverRef}
                placement="top"
            >
                <div className={styles.detailsContainer}>
                    <Typography weight="medium" size="sm">
                        {brand.name}
                    </Typography>
                </div>
            </Popover>
            <div
                ref={setBrandDetails}
                onMouseEnter={handleBrandDetailsPopoverOpen}
                onMouseLeave={handleBrandDetailsPopoverClose}
            >
                <BrandLogo className={styles.icon} />
            </div>
        </div>
    );
}

export function SkeletonDex() {
    return (
        <div className={styles.root}>
            <Skeleton circular className={styles.icon} />
        </div>
    );
}
