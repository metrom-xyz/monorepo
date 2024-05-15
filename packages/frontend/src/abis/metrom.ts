export default [
    {
        inputs: [
            { internalType: "address", name: "_owner", type: "address" },
            { internalType: "address", name: "_updater", type: "address" },
            { internalType: "uint32", name: "_globalFee", type: "uint32" },
            {
                internalType: "uint32",
                name: "_minimumCampaignDuration",
                type: "uint32",
            },
            {
                internalType: "uint32",
                name: "_maximumCampaignDuration",
                type: "uint32",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [{ internalType: "address", name: "target", type: "address" }],
        name: "AddressEmptyCode",
        type: "error",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "AddressInsufficientBalance",
        type: "error",
    },
    { inputs: [], name: "CampaignAlreadyExists", type: "error" },
    { inputs: [], name: "FailedInnerCall", type: "error" },
    { inputs: [], name: "Forbidden", type: "error" },
    { inputs: [], name: "InvalidAccount", type: "error" },
    { inputs: [], name: "InvalidAmount", type: "error" },
    { inputs: [], name: "InvalidData", type: "error" },
    { inputs: [], name: "InvalidFrom", type: "error" },
    { inputs: [], name: "InvalidGlobalFee", type: "error" },
    { inputs: [], name: "InvalidMaximumCampaignDuration", type: "error" },
    { inputs: [], name: "InvalidMinimumCampaignDuration", type: "error" },
    { inputs: [], name: "InvalidOwner", type: "error" },
    { inputs: [], name: "InvalidPool", type: "error" },
    { inputs: [], name: "InvalidProof", type: "error" },
    { inputs: [], name: "InvalidReceiver", type: "error" },
    { inputs: [], name: "InvalidRewards", type: "error" },
    { inputs: [], name: "InvalidRoot", type: "error" },
    { inputs: [], name: "InvalidSpecificFee", type: "error" },
    { inputs: [], name: "InvalidTo", type: "error" },
    { inputs: [], name: "InvalidToken", type: "error" },
    { inputs: [], name: "InvalidUpdater", type: "error" },
    { inputs: [], name: "NonExistentCampaign", type: "error" },
    {
        inputs: [{ internalType: "address", name: "token", type: "address" }],
        name: "SafeERC20FailedOperation",
        type: "error",
    },
    { inputs: [], name: "ZeroAmount", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
            },
        ],
        name: "AcceptCampaignOwnership",
        type: "event",
    },
    { anonymous: false, inputs: [], name: "AcceptOwnership", type: "event" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "receiver",
                type: "address",
            },
        ],
        name: "ClaimFee",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "campaignId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "receiver",
                type: "address",
            },
        ],
        name: "ClaimReward",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "chainId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "pool",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint32",
                name: "from",
                type: "uint32",
            },
            {
                indexed: false,
                internalType: "uint32",
                name: "to",
                type: "uint32",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "specification",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address[]",
                name: "rewardTokens",
                type: "address[]",
            },
            {
                indexed: false,
                internalType: "uint256[]",
                name: "rewardAmounts",
                type: "uint256[]",
            },
            {
                indexed: false,
                internalType: "uint256[]",
                name: "feeAmounts",
                type: "uint256[]",
            },
        ],
        name: "CreateCampaign",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "campaignId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "root",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "data",
                type: "bytes32",
            },
        ],
        name: "DistributeReward",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "updater",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint32",
                name: "globalFee",
                type: "uint32",
            },
            {
                indexed: false,
                internalType: "uint32",
                name: "minimumCampaignDuration",
                type: "uint32",
            },
            {
                indexed: false,
                internalType: "uint32",
                name: "maximumCampaignDuration",
                type: "uint32",
            },
        ],
        name: "Initialize",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "campaignId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "receiver",
                type: "address",
            },
        ],
        name: "RecoverReward",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint32",
                name: "globalFee",
                type: "uint32",
            },
        ],
        name: "SetGlobalFee",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint32",
                name: "maximumCampaignDuration",
                type: "uint32",
            },
        ],
        name: "SetMaximumCampaignDuration",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint32",
                name: "minimumCampaignDuration",
                type: "uint32",
            },
        ],
        name: "SetMinimumCampaignDuration",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint32",
                name: "specificFee",
                type: "uint32",
            },
        ],
        name: "SetSpecificFee",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "updater",
                type: "address",
            },
        ],
        name: "SetUpdater",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "TransferCampaignOwnership",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "TransferOwnership",
        type: "event",
    },
    {
        inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
        name: "acceptCampaignOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "acceptOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
        name: "campaignById",
        outputs: [
            {
                components: [
                    { internalType: "address", name: "owner", type: "address" },
                    {
                        internalType: "address",
                        name: "pendingOwner",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "chainId",
                        type: "uint256",
                    },
                    { internalType: "address", name: "pool", type: "address" },
                    { internalType: "uint32", name: "from", type: "uint32" },
                    { internalType: "uint32", name: "to", type: "uint32" },
                    {
                        internalType: "bytes32",
                        name: "specification",
                        type: "bytes32",
                    },
                    { internalType: "bytes32", name: "root", type: "bytes32" },
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                            {
                                internalType: "uint256",
                                name: "unclaimed",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct ReadonlyReward[]",
                        name: "rewards",
                        type: "tuple[]",
                    },
                ],
                internalType: "struct ReadonlyCampaign",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
        name: "campaignOwner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
        name: "campaignPendingOwner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "token", type: "address" },
                    {
                        internalType: "address",
                        name: "receiver",
                        type: "address",
                    },
                ],
                internalType: "struct ClaimFeeBundle[]",
                name: "_bundles",
                type: "tuple[]",
            },
        ],
        name: "claimFees",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "bytes32",
                        name: "campaignId",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32[]",
                        name: "proof",
                        type: "bytes32[]",
                    },
                    { internalType: "address", name: "token", type: "address" },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "receiver",
                        type: "address",
                    },
                ],
                internalType: "struct ClaimRewardBundle[]",
                name: "_bundles",
                type: "tuple[]",
            },
        ],
        name: "claimRewards",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "token", type: "address" }],
        name: "claimableFees",
        outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "chainId",
                        type: "uint256",
                    },
                    { internalType: "address", name: "pool", type: "address" },
                    { internalType: "uint32", name: "from", type: "uint32" },
                    { internalType: "uint32", name: "to", type: "uint32" },
                    {
                        internalType: "bytes32",
                        name: "specification",
                        type: "bytes32",
                    },
                    {
                        internalType: "address[]",
                        name: "rewardTokens",
                        type: "address[]",
                    },
                    {
                        internalType: "uint256[]",
                        name: "rewardAmounts",
                        type: "uint256[]",
                    },
                ],
                internalType: "struct CreateBundle[]",
                name: "_bundles",
                type: "tuple[]",
            },
        ],
        name: "createCampaigns",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "bytes32",
                        name: "campaignId",
                        type: "bytes32",
                    },
                    { internalType: "bytes32", name: "root", type: "bytes32" },
                    { internalType: "bytes32", name: "data", type: "bytes32" },
                ],
                internalType: "struct DistributeRewardsBundle[]",
                name: "_bundles",
                type: "tuple[]",
            },
        ],
        name: "distributeRewards",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "globalFee",
        outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "maximumCampaignDuration",
        outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "minimumCampaignDuration",
        outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "pendingOwner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "bytes32",
                        name: "campaignId",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32[]",
                        name: "proof",
                        type: "bytes32[]",
                    },
                    { internalType: "address", name: "token", type: "address" },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "receiver",
                        type: "address",
                    },
                ],
                internalType: "struct ClaimRewardBundle[]",
                name: "_bundles",
                type: "tuple[]",
            },
        ],
        name: "recoverRewards",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint32", name: "_globalFee", type: "uint32" },
        ],
        name: "setGlobalFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint32",
                name: "_maximumCampaignDuration",
                type: "uint32",
            },
        ],
        name: "setMaximumCampaignDuration",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint32",
                name: "_minimumCampaignDuration",
                type: "uint32",
            },
        ],
        name: "setMinimumCampaignDuration",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_account", type: "address" },
            { internalType: "uint32", name: "_specificFee", type: "uint32" },
        ],
        name: "setSpecificFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_updater", type: "address" },
        ],
        name: "setUpdater",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_account", type: "address" },
        ],
        name: "specificFeeFor",
        outputs: [
            {
                components: [
                    { internalType: "uint32", name: "fee", type: "uint32" },
                    { internalType: "bool", name: "none", type: "bool" },
                ],
                internalType: "struct SpecificFee",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "_id", type: "bytes32" },
            { internalType: "address", name: "_owner", type: "address" },
        ],
        name: "transferCampaignOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_owner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "updater",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
] as const;
