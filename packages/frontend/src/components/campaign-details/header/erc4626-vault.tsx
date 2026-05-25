import { Button, InfoTooltip, Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import type {
    TargetedNamedCampaign,
    CampaignDetails,
} from "@/src/types/campaign/common";
import { RemoteLogo } from "../../remote-logo";
import { trackUmamiEvent } from "@/src/utils/umami";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { Tags } from "./tags";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import classNames from "classnames";
import { ProtocolType } from "@metrom-xyz/chains";
import { getExplorerLink } from "@/src/utils/explorer";
import { useTranslations } from "next-intl";
import { ARCHE_ARUSD_VAULT_ADDRESSES } from "@/src/commons";

import styles from "./styles.module.css";

interface Erc4626VaultProps {
    campaignDetails: TargetedNamedCampaign<
        TargetType.Erc4626Vault,
        CampaignDetails
    >;
}

export function Erc4626Vault({ campaignDetails }: Erc4626VaultProps) {
    const { chainId, chainData, name, target } = campaignDetails;
    const ChainIcon = chainData?.icon;

    const t = useTranslations("campaignDetails.header");
    const erc4626Vault = useProtocolsInChain({
        chainId,
        type: ProtocolType.Erc4626Vault,
    }).find((brand) => brand.slug === target.brand.slug);

    let depositLink = erc4626Vault?.vaultUrl.replace(
        "{vault}",
        target.vault.address,
    );
    const explorerLink = getExplorerLink(
        target.vault.address,
        target.chainId,
        target.chainType,
    );

    function handleExploreOnClick() {
        trackUmamiEvent("click-fungible-asset-explore");
    }

    if (ARCHE_ARUSD_VAULT_ADDRESSES.includes(target.vault.address)) {
        depositLink = "https://app.arche.money/";
    }

    return (
        <>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <div className={styles.icons}>
                        {ChainIcon && (
                            <InfoTooltip
                                icon={
                                    <ChainIcon className={styles.chainLogo} />
                                }
                            >
                                <Typography size="sm">
                                    {chainData.name}
                                </Typography>
                            </InfoTooltip>
                        )}
                        <RemoteLogo
                            size="lg"
                            address={target.vault.asset}
                            chain={target.chainId}
                        />
                    </div>
                    <div className={styles.name}>
                        <Typography
                            size="xl3"
                            weight="medium"
                            className={styles.nameTypography}
                        >
                            {name}
                        </Typography>
                    </div>
                    <a
                        href={explorerLink}
                        onClick={handleExploreOnClick}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ArrowRightIcon
                            className={classNames(
                                styles.externalLinkIcon,
                                styles.explore,
                            )}
                        />
                    </a>
                </div>
                <Tags campaignDetails={campaignDetails} />
            </div>
            <div className={styles.actions}>
                <Button
                    size="sm"
                    href={depositLink}
                    disabled={!depositLink}
                    icon={ArrowRightIcon}
                    iconPlacement="right"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={{
                        icon: styles.externalLinkIcon,
                    }}
                >
                    {t("erc4626Vault.deposit")}
                </Button>
            </div>
        </>
    );
}
