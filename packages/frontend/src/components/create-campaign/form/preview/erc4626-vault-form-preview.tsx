import { useTranslations } from "next-intl";
import { FormStepPreview } from "../../form-step-preview";
import { Duration } from "../../previews/duration";
import type { FormSteps } from "@/src/context/form-steps";
import {
    allFieldsFilled,
    distributablesCompleted,
    getCampaignFormApr,
} from "@/src/utils/form";
import { Rewards } from "../../previews/rewards";
import { Typography } from "@metrom-xyz/ui";
import { getCampaignTargetValueName } from "@/src/utils/campaign";
import { formatUsdAmount } from "@/src/utils/format";
import { Kpi } from "../../previews/kpi";
import {
    getErc4626VaultTargetValue,
    type Erc4626VaultCampaignPayload,
} from "@/src/types/campaign/erc4626-vault-campaign";
import { ERC4626_VAULT_BASIC_PAYLOAD_KEYS } from "../erc4626-vault-form/erc4626-vault-basics-step";
import { Erc4626VaultTarget } from "../../previews/erc4626-vault-target";

import styles from "./styles.module.css";

interface Erc4626VaultFormPreviewProps {
    payload: Erc4626VaultCampaignPayload;
    errors: FormSteps<string>;
}

export function Erc4626VaultFormPreview({
    payload,
    errors,
}: Erc4626VaultFormPreviewProps) {
    const globalT = useTranslations();
    const t = useTranslations("newCampaign.formPreview");

    const completed =
        !errors.basics &&
        allFieldsFilled(payload, ERC4626_VAULT_BASIC_PAYLOAD_KEYS);

    const rewardsCompleted = distributablesCompleted(payload);
    const apr = getCampaignFormApr(
        payload,
        getErc4626VaultTargetValue(payload),
    );
    const kpiSetup = payload?.kpiDistribution;

    return (
        <>
            <FormStepPreview
                title={
                    <div className={styles.basicsHeader}>
                        <Typography size="xs" weight="semibold" uppercase>
                            {t("campaignBasics")}
                        </Typography>
                        {payload.kind && payload.vault && (
                            <div className={styles.targetUsdChip}>
                                <Typography size="xs" weight="medium" uppercase>
                                    {getCampaignTargetValueName(
                                        globalT,
                                        payload.kind,
                                    )}
                                    :{" "}
                                    {formatUsdAmount({
                                        amount: payload.vault.usdTvl,
                                    })}
                                </Typography>
                            </div>
                        )}
                    </div>
                }
                completed={completed}
                error={!!errors.basics}
            >
                <Erc4626VaultTarget payload={payload} />
                <Duration
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                />
            </FormStepPreview>
            {rewardsCompleted && (
                <Rewards
                    chainId={payload.chainId}
                    apr={apr}
                    completed={rewardsCompleted}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    distributables={payload.distributables}
                    fixedDistribution={payload.fixedDistribution}
                    restrictions={payload.restrictions}
                />
            )}
            {kpiSetup && <Kpi kpiDistribution={payload.kpiDistribution} />}
        </>
    );
}
