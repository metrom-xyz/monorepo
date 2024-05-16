export const messages = {
    en: {
        navigation: {
            campaigns: {
                all: "All Campaigns",
                create: "New campaign",
            },
        },
        account: {
            connect: "Connect",
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
                        inputLabel: "Select pool",
                        inputPlaceholder: "Search for token address, pool etc",
                        noPools: "Nothing here.",
                    },
                },
            },
            rewards: {
                title: "Rewards",
                select: {
                    placeholder: "Token",
                    search: {
                        inputLabel: "Select token",
                        inputPlaceholder: "Search",
                        noTokens: "Nothing here.",
                    },
                },
                amount: "Amount",
                insufficientBalance: {
                    label: "Insufficient balance",
                    balance: "{symbol} balance: {balance}",
                },
                addReward: "Add reward",
                maxRewards: "Rewards limit reached",
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
                        description:
                            "The start date can't be in the past, and the campaign duration must be more than {minDuration} minutes but less than {maxDuration} days.",
                    },
                },
            },
            deploy: {
                title: "Launch",
                connectWallet: "Connect wallet to continue",
                confirm: "Confirm",
                edit: "Edit campaign",
                approveReward: "Approve reward: ",
                launch: "Launch campaign",
                success: "Campaign deployed",
            },
        },
        allCampaigns: {
            rewards: {
                available: "Available claims: {total}",
                claim: "Claim",
            },
            table: {
                filters: {
                    pools: "Search for pools",
                },
                header: {
                    network: "Network",
                    pool: "Pool",
                    apr: "Apr",
                    tvl: "Tvl",
                    status: "Status",
                    rewards: "Rewards",
                    amm: "Deposit",
                    links: "Links",
                },
                status: {
                    live: "Live",
                    expired: "Expired",
                    soon: "Soon",
                },
                rewards: {
                    amount: "Amount",
                    unclaimed: "Unclaimed",
                },
                empty: "Nothing here.",
            },
        },
        carrot: "Carrot",
        powered: "Powered by {0}",
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
