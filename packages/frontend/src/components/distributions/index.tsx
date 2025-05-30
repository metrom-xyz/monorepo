"use client";

import {
    useDistributions,
    type ProcessedDistribution,
} from "@/src/hooks/useDistributions";
import { DateTimePicker, TextInput, Typography } from "@metrom-xyz/ui";
import type { Dayjs } from "dayjs";
import { useState, type ChangeEvent } from "react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { TooltipContent } from "./tooltip";
import type { Address } from "viem";

import styles from "./styles.module.css";
import {
    formatAmount,
    formatDateTime,
    formatPercentage,
} from "@/src/utils/format";
import { RemoteLogo } from "../remote-logo";
import { useChainId } from "wagmi";
import { shortenAddress } from "@/src/utils/address";

export interface DistributionChartData extends ProcessedDistribution {}

export function Distributions() {
    const [campaignId, setCampaignId] = useState<Address>();
    const [from, setFrom] = useState<Dayjs | undefined>();
    const [to, setTo] = useState<Dayjs | undefined>();

    const chainId = useChainId();
    const { distributions, loading } = useDistributions({
        campaignId,
        from,
        to,
    });

    function handleCampaignIdOnChange(event: ChangeEvent<HTMLInputElement>) {
        setCampaignId(event.target.value as Address);
    }

    return (
        <div className={styles.root}>
            <TextInput
                label="Campaign id"
                value={campaignId}
                onChange={handleCampaignIdOnChange}
                className={styles.campaignIdInput}
            />
            <div className={styles.datePickersWrapper}>
                <DateTimePicker
                    value={from}
                    range={{ from, to }}
                    onChange={setFrom}
                />
                <DateTimePicker
                    value={to}
                    range={{ from, to }}
                    onChange={setTo}
                />
            </div>
            <div className={styles.chartsWrapper}>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    distributions.map((data) => {
                        return (
                            <div
                                key={data.timestamp}
                                className={styles.distributionWrapper}
                            >
                                <ResponsiveContainer
                                    key={data.timestamp}
                                    width={300}
                                    height={500}
                                >
                                    <BarChart
                                        data={[data]}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Tooltip
                                            isAnimationActive={false}
                                            cursor={false}
                                            content={<TooltipContent />}
                                        />

                                        <YAxis ticks={[0, 1]} hide />
                                        <XAxis
                                            dataKey="timestamp"
                                            tickFormatter={(value) =>
                                                formatDateTime(value)
                                            }
                                        />

                                        {Object.entries(data.weights).map(
                                            ([token, weight]) => {
                                                return Object.keys(weight).map(
                                                    (account) => {
                                                        return (
                                                            <Bar
                                                                key={account}
                                                                dataKey={`weights.${token}.${account}.percentage.formatted`}
                                                                // dataKey={`weights.${token}.${account}`}
                                                                stackId={`${token}`}
                                                                isAnimationActive={
                                                                    false
                                                                }
                                                                fill={getColorFromEthAddress(
                                                                    account,
                                                                )}
                                                            />
                                                        );
                                                    },
                                                );
                                            },
                                        )}
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className={styles.distributionDetails}>
                                    {Object.entries(data.weights).map(
                                        ([token, weight]) => {
                                            return (
                                                <div
                                                    key={token}
                                                    className={
                                                        styles.tokenColumn
                                                    }
                                                >
                                                    <RemoteLogo
                                                        address={
                                                            token as Address
                                                        }
                                                        chain={chainId}
                                                    />
                                                    <div
                                                        className={
                                                            styles.accounts
                                                        }
                                                    >
                                                        {Object.entries(weight)
                                                            .sort(
                                                                (a, b) =>
                                                                    b[1]
                                                                        .percentage
                                                                        .formatted -
                                                                    a[1]
                                                                        .percentage
                                                                        .formatted,
                                                            )
                                                            .map(
                                                                ([
                                                                    account,
                                                                    {
                                                                        amount,
                                                                        percentage,
                                                                    },
                                                                ]) => (
                                                                    <div
                                                                        key={
                                                                            account
                                                                        }
                                                                        className={
                                                                            styles.accountRow
                                                                        }
                                                                    >
                                                                        <Typography
                                                                            size="sm"
                                                                            light
                                                                        >
                                                                            {
                                                                                account
                                                                            }
                                                                        </Typography>
                                                                        <Typography>
                                                                            {formatAmount(
                                                                                {
                                                                                    amount: amount.formatted,
                                                                                },
                                                                            )}
                                                                        </Typography>
                                                                        <Typography>
                                                                            {formatPercentage(
                                                                                {
                                                                                    percentage:
                                                                                        percentage.formatted,
                                                                                    keepDust:
                                                                                        true,
                                                                                },
                                                                            )}
                                                                        </Typography>
                                                                    </div>
                                                                ),
                                                            )}
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function getColorFromEthAddress(address: string) {
    let hash = 0;
    const cleanAddress = address.toLowerCase().replace(/^0x/, "");

    for (let i = 0; i < cleanAddress.length; i++) {
        hash = cleanAddress.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color = (hash & 0x00ffffff).toString(16).padStart(6, "0");
    return `#${color}`;
}
