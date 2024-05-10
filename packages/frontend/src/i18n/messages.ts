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
                pair: "Pair",
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
            pair: {
                title: "Pick a pair",
                select: {
                    placeholder: "Select pair",
                    placeholderNoPairs: "No pairs found for the selected DEX",
                    search: {
                        inputLabel: "Select pair",
                        inputPlaceholder: "Search for token address, pair etc",
                        noPairs: "Nothing here.",
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
            table: {
                filters: {
                    pairs: "Search for pairs",
                },
                header: {
                    network: "Network",
                    pair: "Pair",
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
            pairSelect: {
                pair: "Pair",
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
