export enum PartnerActionType {
    AaveV3BridgeAndSupply = "aave-v3-bridge-and-supply",
    JumperWhitelistedAmmPoolLiquidity = "jumper-whitelisted-amm-pool-liquidity",
}

export interface PartnerAction {
    active: boolean;
    type: PartnerActionType;
}
