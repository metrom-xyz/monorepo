import { Button, Typography, TextField } from "@metrom-xyz/ui";
import type { CampaignPayload } from "@/src/types";
import {
    useChainId,
    usePublicClient,
    useSimulateContract,
    useWriteContract,
} from "wagmi";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MetromLightLogo } from "@/src/assets/metrom-light-logo";
import { useRouter } from "@/src/i18n/routing";
import { useChainData } from "@/src/hooks/useChainData";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { ApproveRewardsButton } from "../approve-rewards-button";
import { Rewards } from "./rewards";
import { Header } from "./header";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { getCampaignPreviewApr } from "@/src/utils/campaign";
import { trackFathomEvent } from "@/src/utils/fathom";
import { type Hex, zeroHash } from "viem";
import { SERVICE_URLS, type FullSpecification } from "@metrom-xyz/sdk";
import { ENVIRONMENT } from "@/src/commons/env";

import styles from "./styles.module.css";

interface CampaignPreviewProps {
    malformedPayload: boolean;
    payload: CampaignPayload;
    onBack: () => void;
    onCreateNew: () => void;
}

export function CampaignPreview({
    malformedPayload,
    payload,
    onBack,
    onCreateNew,
}: CampaignPreviewProps) {
    const t = useTranslations("campaignPreview");
    const [deploying, setDeploying] = useState(false);
    const [uploadingSpecification, setUploadingSpecification] = useState(false);
    const [created, setCreated] = useState(false);
    const [rewardsApproved, setRewardsApproved] = useState(false);
    const [specificationHash, setSpecificationHash] = useState<Hex>(zeroHash);
    const [error, setError] = useState("");

    const feedback = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { width, height } = useWindowSize();
    const chainId = useChainId();
    const chainData = useChainData(chainId);
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    const secondsDuration = useMemo(() => {
        if (!payload.endDate) return 0;
        return payload.endDate.diff(payload.startDate, "seconds", false);
    }, [payload.endDate, payload.startDate]);

    const {
        data: simulatedCreate,
        isLoading: simulatingCreate,
        isError: simulateCreateErrored,
        error: simulateCreateError,
    } = useSimulateContract({
        abi: metromAbi,
        address: chainData?.metromContract.address,
        functionName: "createCampaigns",
        args: [
            rewardsApproved &&
            payload.pool &&
            payload.startDate &&
            payload.endDate &&
            payload.rewards &&
            payload.rewards.length > 0
                ? [
                      {
                          pool: payload.pool.address,
                          from: payload.startDate.unix(),
                          to: payload.endDate.unix(),
                          specification: specificationHash,
                          rewards: payload.rewards.map((reward) => ({
                              token: reward.token.address,
                              amount: reward.amount.raw,
                          })),
                      },
                  ]
                : [],
        ],
        query: {
            enabled:
                rewardsApproved &&
                !malformedPayload &&
                !!payload.pool &&
                !!payload.startDate &&
                !!payload.endDate &&
                !!payload.rewards &&
                payload.rewards.length > 0,
        },
    });

    useEffect(() => {
        const uploadSpecification = async () => {
            setUploadingSpecification(true);

            const specification: FullSpecification = {
                // TODO: add restrictions
                kpi: payload.kpiSpecification,
            };

            try {
                const response = await fetch(
                    `${SERVICE_URLS[ENVIRONMENT].dataManager}/data/temporary`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(specification),
                    },
                );

                if (!response.ok) throw new Error(await response.text());

                const { hash } = (await response.json()) as { hash: Hex };
                setSpecificationHash(`0x${hash}`);
            } catch (error) {
                console.error(
                    `Could not upload specification to data-manager: ${JSON.stringify(specification)}`,
                    error,
                );
                setError("kpiUpload");
            } finally {
                setUploadingSpecification(false);
            }
        };

        // TODO: add restrictions check
        if (payload.kpiSpecification && rewardsApproved) uploadSpecification();
    }, [payload.kpiSpecification, rewardsApproved]);

    function handleOnRewardsApproved() {
        setRewardsApproved(true);
    }

    const handleOnDeploy = useCallback(() => {
        if (simulateCreateErrored) {
            console.warn(
                `Could not deploy the campaign: ${simulateCreateError}`,
            );
            return;
        }

        if (!writeContractAsync || !publicClient || !simulatedCreate?.request)
            return;

        const create = async () => {
            setDeploying(true);
            try {
                const tx = await writeContractAsync(simulatedCreate.request);
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });

                if (receipt.status === "reverted") {
                    console.warn("creation transaction reverted");
                    return;
                }

                setCreated(true);
                trackFathomEvent("CLICK_DEPLOY_CAMPAIGN");
            } catch (error) {
                console.warn("could not create kpi token", error);
            } finally {
                setDeploying(false);
            }
        };
        void create();
    }, [
        publicClient,
        simulateCreateError,
        simulateCreateErrored,
        simulatedCreate,
        writeContractAsync,
    ]);

    function handleGoToAllCampaigns() {
        router.push("/");
    }

    // TODO: add notification toast in case of errors
    if (!created) {
        return (
            <div ref={feedback} className={styles.root}>
                <Header
                    backDisabled={simulatingCreate || deploying}
                    payload={payload}
                    onBack={onBack}
                />
                <div className={styles.content}>
                    <div className={styles.contentGrid}>
                        <TextField
                            boxed
                            label={t("tvl")}
                            value={formatUsdAmount(payload.pool?.tvl)}
                        />
                        <TextField
                            boxed
                            label={t("apr")}
                            value={formatPercentage(
                                getCampaignPreviewApr(payload),
                            )}
                        />
                    </div>
                    <Rewards
                        rewards={payload.rewards}
                        campaignDurationSeconds={secondsDuration}
                    />
                    <div className={styles.deployButtonContainer}>
                        {rewardsApproved ? (
                            <Button
                                icon={ArrowRightIcon}
                                iconPlacement="right"
                                disabled={
                                    !!error ||
                                    malformedPayload ||
                                    simulateCreateErrored
                                }
                                loading={uploadingSpecification || deploying}
                                className={{ root: styles.deployButton }}
                                onClick={handleOnDeploy}
                            >
                                {t("deploy")}
                            </Button>
                        ) : (
                            <ApproveRewardsButton
                                malformedPayload={malformedPayload}
                                payload={payload}
                                onApproved={handleOnRewardsApproved}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.feedback}>
            <MetromLightLogo className={styles.metromLogo} />
            <Typography uppercase weight="medium">
                {t("congratulations")}
            </Typography>
            <Typography variant="xl2" weight="medium">
                {t("launched")}
            </Typography>
            <div className={styles.feedbackActionsContainer}>
                <Button
                    onClick={handleGoToAllCampaigns}
                    variant="secondary"
                    className={{ root: styles.feedbackButton }}
                >
                    {t("allCampaigns")}
                </Button>
                <Button
                    onClick={onCreateNew}
                    className={{ root: styles.feedbackButton }}
                >
                    {t("newCampaign")}
                </Button>
            </div>
            <Confetti
                numberOfPieces={600}
                confettiSource={{
                    x: 0,
                    y: 0,
                    w: width,
                    h: height,
                }}
                run={true}
                width={width}
                height={height}
                recycle={false}
                initialVelocityY={30}
                colors={["#163A5F", "#45EBA5", "#21ABA5", "#1D566E", "#163A5F"]}
            />
        </div>
    );
}
