import { useTranslations } from "next-intl";
import { FormStep } from "../../form-step";
import { useEffect, useState } from "react";
import type { CampaignPreviewPayload } from "@/src/types/campaign/common";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import { formatUsdAmount } from "@/src/utils/format";
import { useFormSteps } from "@/src/context/form-steps";
import { useCampaignFee } from "@/src/hooks/useCampaignFee";
import { useChainType } from "@/src/hooks/useChainType";
import { ChainType, SERVICE_URLS, type Specification } from "@metrom-xyz/sdk";
import { InfoMessage } from "@/src/components/info-message";
import { zeroHash, type Hex } from "viem";
import { buildSpecificationBundle } from "@/src/utils/campaign-bundle";
import { ENVIRONMENT } from "@/src/commons/env";
import type { LocalizedMessage } from "@/src/types/utils";
import { ApproveAndLaunch } from "./approve-and-launch";
import { FormStepId } from "@/src/types/form";

import styles from "./styles.module.css";

interface CampaignApproveLaunchStepProps {
    payload: CampaignPreviewPayload | null;
    disabled?: boolean;
    onLaunch: () => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.approveLaunch">;

export function CampaignApproveLaunchStep({
    payload,
    disabled,
    onLaunch,
}: CampaignApproveLaunchStepProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<ErrorMessage>("");
    const [uploadingSpecification, setUploadingSpecification] = useState(false);
    const [allTokensApproved, setAllTokensApproved] = useState(false);
    const [specificationHash, setSpecificationHash] = useState<Hex>(zeroHash);

    const t = useTranslations("newCampaign.form.approveLaunch");
    const chainType = useChainType();
    const { errors, activeStepId } = useFormSteps();
    const { campaignFee, loading: loadingCampaignFee } = useCampaignFee({
        distributables: payload?.distributables,
    });

    useEffect(() => {
        setOpen(activeStepId === FormStepId.Launch);
    }, [activeStepId]);

    useEffect(() => {
        if (!payload || disabled) return;
        const specification = buildSpecificationBundle(payload);

        const uploadSpecification = async (bundle: Specification) => {
            setUploadingSpecification(true);

            try {
                const response = await fetch(
                    `${SERVICE_URLS[ENVIRONMENT].dataManager}/data/temporary`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(bundle),
                    },
                );

                if (!response.ok) throw new Error(await response.text());

                const { hash } = (await response.json()) as { hash: Hex };
                setSpecificationHash(`0x${hash}`);
            } catch (error) {
                console.error(
                    `Could not upload specification to data-manager: ${JSON.stringify(bundle)}`,
                    error,
                );
                setError("errors.specification");
            } finally {
                setUploadingSpecification(false);
            }
        };

        const { distribution, priceRange, weighting, blacklist, whitelist } =
            specification;

        if (
            (distribution ||
                priceRange ||
                weighting ||
                (blacklist && blacklist.length > 0) ||
                (whitelist && whitelist.length > 0)) &&
            allTokensApproved
        )
            uploadSpecification(specification);
    }, [payload, disabled, allTokensApproved]);

    return (
        <FormStep
            title={t("title")}
            titleDecorator={
                open && (
                    <div className={styles.feeChip}>
                        {loadingCampaignFee ? (
                            <Skeleton
                                size="xs"
                                className={styles.feeSkeleton}
                            />
                        ) : (
                            <Typography size="xs" weight="medium" uppercase>
                                {t("protocolFee", {
                                    feeUsd: formatUsdAmount({
                                        amount: campaignFee,
                                    }),
                                })}
                            </Typography>
                        )}
                    </div>
                )
            }
            open={open}
            disabled={disabled}
            error={errors.approveLaunch}
            onToggle={setOpen}
            className={styles.root}
        >
            <InfoMessage
                weight="regular"
                size="sm"
                text={
                    chainType === ChainType.Aptos
                        ? t("noApproveNeeded")
                        : t("approveDescription")
                }
            />
            {payload && (
                <ApproveAndLaunch
                    payload={payload}
                    specificationHash={specificationHash}
                    uploadingSpecification={uploadingSpecification}
                    disabled={!!error}
                    onAllTokensApproved={setAllTokensApproved}
                    onLaunch={onLaunch}
                />
            )}
        </FormStep>
    );
}
