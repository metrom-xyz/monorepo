import { Button, Typography, TextField, ErrorText } from "@metrom-xyz/ui";
import type { CampaignPayload } from "@/src/types";
import {
    useChainId,
    usePublicClient,
    useSimulateContract,
    useWriteContract,
} from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MetromLightLogo } from "@/src/assets/metrom-light-logo";
import { useRouter } from "@/src/i18n/routing";
import { useChainData } from "@/src/hooks/useChainData";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { ApproveRewardsButton } from "./approve-rewards-button";
import { Rewards } from "./rewards";
import { Header } from "./header";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { getCampaignPreviewApr } from "@/src/utils/campaign";
import { trackFathomEvent } from "@/src/utils/fathom";
import { type Hex, zeroHash } from "viem";
import { encodeFunctionData } from "viem/utils";
import { SERVICE_URLS, type Specification } from "@metrom-xyz/sdk";
import { ENVIRONMENT, KPI } from "@/src/commons/env";
import { Kpi } from "./kpi";
import { useIsSafe } from "@/src/hooks/useIsSafe";
import SafeAppsSdk, { type BaseTransaction } from "@safe-global/safe-apps-sdk";

import styles from "./styles.module.css";

const safeSdk = new SafeAppsSdk();

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
    const router = useRouter();
    const chainId = useChainId();
    const chainData = useChainData(chainId);
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    const safeContext = useIsSafe();

    const feedback = useRef<HTMLDivElement>(null);

    const [deploying, setDeploying] = useState(false);
    const [uploadingSpecification, setUploadingSpecification] = useState(false);
    const [created, setCreated] = useState(false);
    const [rewardsApproved, setRewardsApproved] = useState(false);
    const [specificationHash, setSpecificationHash] = useState<Hex>(zeroHash);
    const [error, setError] = useState("");
    const [safeTxs, setSafeTxs] = useState<BaseTransaction[]>([]);

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
                !safeContext &&
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

            const { restrictions, kpiSpecification } = payload;

            let specification: Specification = {
                kpi: kpiSpecification,
            };
            if (restrictions)
                specification[restrictions.type] = restrictions?.list;

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
                setError("errors.specification");
            } finally {
                setUploadingSpecification(false);
            }
        };

        if (
            (payload.kpiSpecification || payload.restrictions) &&
            rewardsApproved
        )
            uploadSpecification();
    }, [
        payload,
        payload.kpiSpecification,
        payload.restrictions,
        rewardsApproved,
    ]);

    const handleSafeTransaction = useCallback(
        (tx: BaseTransaction) => {
            setSafeTxs([...safeTxs, tx]);
        },
        [safeTxs],
    );

    function handleOnRewardsApproved() {
        setRewardsApproved(true);
    }

    const handleStandardDeploy = useCallback(() => {
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
                console.warn("Could not create campaign", error);
            } finally {
                setDeploying(false);
            }
        };
        void create();
    }, [
        publicClient,
        simulateCreateError,
        simulateCreateErrored,
        simulatedCreate?.request,
        writeContractAsync,
    ]);

    const handleSafeDeploy = useCallback(() => {
        if (
            !rewardsApproved ||
            !chainData?.metromContract.address ||
            !payload.pool ||
            !payload.startDate ||
            !payload.endDate ||
            !payload.rewards ||
            payload.rewards.length === 0
        ) {
            console.warn(
                "Missing parameters to deploy campaign through Safe: aborting",
            );
            return;
        }

        safeTxs.push({
            to: chainData.metromContract.address,
            data: encodeFunctionData({
                abi: metromAbi,
                functionName: "createCampaigns",
                args: [
                    [
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
                    ],
                ],
            }),
            value: "0",
        });

        const create = async () => {
            setDeploying(true);
            try {
                await safeSdk.txs.send({ txs: safeTxs });

                setCreated(true);
                trackFathomEvent("CLICK_DEPLOY_CAMPAIGN");
            } catch (error) {
                console.warn("Could not create campaign", error);
            } finally {
                setDeploying(false);
            }
        };

        void create();
    }, [
        chainData?.metromContract.address,
        payload.endDate,
        payload.pool,
        payload.rewards,
        payload.startDate,
        rewardsApproved,
        safeTxs,
        specificationHash,
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
                    {KPI && !!payload.kpiSpecification && (
                        <Kpi
                            poolUsdTvl={payload.pool?.usdTvl}
                            rewards={payload.rewards}
                            specification={payload.kpiSpecification}
                        />
                    )}
                    <div className={styles.contentGrid}>
                        <TextField
                            boxed
                            variant="xl"
                            label={t("tvl")}
                            value={formatUsdAmount(payload.pool?.usdTvl)}
                        />
                        <TextField
                            boxed
                            variant="xl"
                            label={t("apr")}
                            value={formatPercentage(
                                getCampaignPreviewApr(payload),
                            )}
                        />
                    </div>
                    <Rewards
                        rewards={payload.rewards}
                        startDate={payload.startDate}
                        endDate={payload.endDate}
                    />
                    <div className={styles.deployButtonContainer}>
                        {error && (
                            <ErrorText variant="xs" weight="medium">
                                {t(error)}
                            </ErrorText>
                        )}
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
                                onClick={
                                    safeContext
                                        ? handleSafeDeploy
                                        : handleStandardDeploy
                                }
                            >
                                {t("deploy")}
                            </Button>
                        ) : (
                            <ApproveRewardsButton
                                malformedPayload={malformedPayload}
                                payload={payload}
                                onApproved={handleOnRewardsApproved}
                                onSafeTx={handleSafeTransaction}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // TODO: this must be reviewed for the Safe app, as the Safe app doesn't really
    // create the campaign immediately, and instead prepares the tx batch to be signed
    // by multisig participants, so we need a new screen or at the very least a different
    // text
    return (
        <div className={styles.feedback}>
            <MetromLightLogo className={styles.metromLogo} />
            <Typography uppercase weight="medium">
                {t("congratulations")}
            </Typography>
            <Typography variant="xl2" weight="medium">
                {safeContext ? t("launched.safe") : t("launched.standard")}
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
        </div>
    );
}
