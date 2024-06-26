export const messages = {
    en: {
        navigation: {
            campaigns: {
                all: "All Campaigns",
                create: "New Campaign",
            },
        },
        wallet: {
            connect: "Connect wallet",
        },
        chain: {
            unsupported: {
                title: "Unsupported network",
                content:
                    "Your connected network is unsupported. Switch to a supported network from your wallet.",
            },
            wrong: {
                title: "Wrong network",
                content:
                    "In order to view this page please switch to {chainName} in your connected wallet to continue.",
            },
        },
        authenticate: {
            title: "Welcome to Metrom",
            description:
                "In order to create campaigns it's necessary to sign a message. This request will not trigger a blockchain transaction or cost you any fees.",
            sign: "Sign message",
        },
        campaign: {
            summary: {
                title: "Campaign summary",
                pool: "Pool",
                amm: "DEX",
                rewards: "Rewards",
                period: "Duration",
                periodFrom: "Start",
                periodTo: "To",
            },
            amm: {
                title: "Pick a DEX",
                network: "Network",
                dex: "Dex",
            },
            pool: {
                title: "Pick a pool",
                select: {
                    placeholder: "Select pool",
                    placeholderNoPools: "No pools found for the selected DEX",
                    search: {
                        label: "Select pool",
                        placeholder: "Search for token address, pool etc",
                        noPools: "Nothing here.",
                        pool: "Pool",
                        tvl: "TVL",
                    },
                },
            },
            rewards: {
                title: "Rewards",
                select: {
                    placeholder: "Token",
                    search: {
                        label: "Select token",
                        placeholder: "Search",
                        noTokens: "Nothing here.",
                    },
                },
                amount: "Amount",
                insufficientBalance: {
                    label: "Insufficient balance",
                    info: "{symbol} balance: {balance}.",
                },
                lowRate: {
                    label: "Distribution rate too low",
                    info: "The minimum {symbol} amount for the selected campaign duration is {minimumRewardAmount}. The minimum distribution rate is {minimumRewardRate} {symbol} per hour.",
                },
                addReward: "Add reward",
                maxRewards: "Rewards limit reached",
            },
            restrictions: {
                add: "Add restrictions",
                amount: "{n} Restriction | {n} Restrictions",
                overview:
                    "Blacklist addresses that shouldn't receive rewards, or whitelist those that should be the only ones eligible.",
                whitelist: "Whitelist",
                blacklist: "Blacklist",
                input: {
                    placeholder: "Enter address",
                    button: "Add",
                    error: {
                        duplicated: "Address already restricted",
                        maximum: "Restrictions limit reached",
                    },
                },
                apply: "Apply",
            },
            range: {
                title: "Pick a period",
                picker: {
                    apply: "Apply",
                    startLabel: "Start",
                    endLabel: "End",
                    startPlaceholder: "Start",
                    endPlaceholder: "End",
                    error: {
                        label: "Period not valid",
                        pastStartDate: "Start date can't be in the past.",
                        pastEndDate: "End date can't be in the past.",
                        minimumDuration:
                            "The campaign duration must be more than {minDuration} minutes.",
                        maximumDuration:
                            "The campaign duration must be less than {maxDuration} days.",
                    },
                },
            },
            deploy: {
                title: "Launch",
                connectWallet: "Connect wallet to continue",
                confirm: "Confirm",
                edit: "Edit campaign",
                approveReward: "Approve reward: ",
                fee: "Protocol fee: ",
                launch: "Launch campaign",
                success: "Campaign deployed",
            },
        },
        allCampaigns: {
            rewards: {
                available: "Available claims: {total}",
                overview: "Rewards overview",
                showAll: "Show all",
                remaining: "Claimable amount",
                amount: "Assigned amount",
                nothingToClaim: "Nothing to claim",
                empty: "No claimable rewards.",
                claim: "Claim",
            },
            table: {
                filters: {
                    pools: "Search for pools",
                },
                header: {
                    pool: "Pool",
                    period: "Period",
                    apr: "Apr",
                    status: "Status",
                    rewards: "Rewards",
                    amm: "Deposit",
                    links: "Links",
                },
                period: {
                    from: "Start",
                    to: "End",
                },
                rewards: {
                    amount: "Amount",
                    remaining: "Remaining",
                },
                empty: "Nothing here.",
            },
        },
        ui: {
            poolSelect: {
                pool: "Pool",
                tvl: "Tvl",
            },
            dateRangeInput: {
                picker: {
                    ok: "Ok",
                },
            },
        },
    },
};
