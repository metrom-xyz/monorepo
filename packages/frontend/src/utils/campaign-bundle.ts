import { type Hex, encodeAbiParameters, stringToHex, isAddress } from "viem";
import { WEIGHT_UNIT } from "../commons";
import {
    Serializer,
    AccountAddress,
    MoveString,
    U32,
    MoveVector,
} from "@aptos-labs/ts-sdk";
import { type CampaignPreviewPayload } from "../types/campaign/common";
import {
    CampaignKind,
    SupportedBridge,
    type Specification,
} from "@metrom-xyz/sdk";
import { AmmPoolLiquidityCampaignPreviewPayload } from "../types/campaign/amm-pool-liquidity-campaign";
import { LiquityV2CampaignPreviewPayload } from "../types/campaign/liquity-v2-campaign";
import { EmptyTargetCampaignPreviewPayload } from "../types/campaign/empty-target-campaign";
import { AaveV3CampaignPreviewPayload } from "../types/campaign/aave-v3-campaign";
import { HoldFungibleAssetCampaignPreviewPayload } from "../types/campaign/hold-fungible-asset-campaign";

export function buildCampaignDataBundleEvm(payload: CampaignPreviewPayload) {
    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload)
        return encodeAbiParameters(
            [
                {
                    name: "poolAddress",
                    type: isAddress(payload.pool.id) ? "address" : "bytes32",
                },
            ],
            [payload.pool.id],
        );
    else if (payload instanceof LiquityV2CampaignPreviewPayload) {
        return encodeAbiParameters(
            [
                { name: "brand", type: "bytes32" },
                { name: "collateral", type: "address" },
            ],
            [
                stringToHex(payload.brand.slug).padEnd(66, "0") as Hex,
                payload.collateral.address,
            ],
        );
    } else if (payload instanceof AaveV3CampaignPreviewPayload) {
        const blacklistedCollaterals =
            payload.kind === CampaignKind.AaveV3NetSupply &&
            payload.blacklistedCollaterals
                ? payload.blacklistedCollaterals.map(({ address }) => address)
                : [];

        return encodeAbiParameters(
            [
                { name: "brand", type: "bytes32" },
                { name: "market", type: "address" },
                { name: "collateral", type: "address" },
                { name: "blacklistedCollaterals", type: "address[]" },
            ],
            [
                stringToHex(payload.brand.slug).padEnd(66, "0") as Hex,
                payload.market.address,
                payload.collateral.address,
                blacklistedCollaterals,
            ],
        );
    } else if (payload instanceof EmptyTargetCampaignPreviewPayload) {
        return "0x";
    } else return null;
}

export function buildCampaignDataBundleMvm(payload: CampaignPreviewPayload) {
    const serializableParts = [];
    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload) {
        serializableParts.push(AccountAddress.fromString(payload.pool.id));
    } else if (payload instanceof LiquityV2CampaignPreviewPayload) {
        serializableParts.push(new MoveString(payload.brand.slug));
        serializableParts.push(
            AccountAddress.fromString(payload.collateral.address),
        );
    } else if (payload instanceof AaveV3CampaignPreviewPayload) {
        // TODO: have the bridge brand in the campaign payload
        if (payload.kind === CampaignKind.AaveV3BridgeAndSupply)
            serializableParts.push(new MoveString(SupportedBridge.LayerZero));

        serializableParts.push(new MoveString(payload.brand.slug));
        serializableParts.push(
            AccountAddress.fromString(payload.market.address),
        );
        serializableParts.push(
            AccountAddress.fromString(payload.collateral.address),
        );

        if (
            payload.boostingFactor &&
            payload.kind === CampaignKind.AaveV3BridgeAndSupply
        ) {
            serializableParts.push(
                new U32(Math.floor(payload.boostingFactor * 100 * 1_000_000)),
            );
        }

        if (payload.kind === CampaignKind.AaveV3NetSupply) {
            const blacklistedCollaterals = payload.blacklistedCollaterals || [];
            serializableParts.push(
                new MoveVector(
                    blacklistedCollaterals.map(({ address }) =>
                        AccountAddress.fromString(address),
                    ),
                ),
            );
        }
    } else if (payload instanceof HoldFungibleAssetCampaignPreviewPayload) {
        serializableParts.push(
            AccountAddress.fromString(payload.asset.address),
        );
        serializableParts.push(
            new MoveVector(
                payload.stakingAssets.map(({ address }) =>
                    AccountAddress.fromString(address),
                ),
            ),
        );
    } else if (payload instanceof EmptyTargetCampaignPreviewPayload) {
        return [];
    } else return null;

    const serializer = new Serializer();
    for (const part of serializableParts) {
        part.serialize(serializer);
    }

    return serializer.toUint8Array();
}

export function buildSpecificationBundle(
    payload: CampaignPreviewPayload,
): Specification {
    const specification: Specification = {};

    if (payload.kpiSpecification) specification.kpi = payload.kpiSpecification;

    if (payload.restrictions)
        specification[payload.restrictions.type] = payload.restrictions.list;

    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload) {
        if (payload.priceRangeSpecification) {
            let from;
            let to;
            if (payload.priceRangeSpecification.token0To1) {
                from = payload.priceRangeSpecification.from.tick;
                to = payload.priceRangeSpecification.to.tick;
            } else {
                from = -payload.priceRangeSpecification.to.tick;
                to = -payload.priceRangeSpecification.from.tick;
            }

            specification.priceRange = { from, to };
        }

        if (payload.weighting) {
            specification.weighting = {
                token0: (payload.weighting.token0 * WEIGHT_UNIT) / 100,
                token1: (payload.weighting.token1 * WEIGHT_UNIT) / 100,
                liquidity: (payload.weighting.liquidity * WEIGHT_UNIT) / 100,
            };
        }
    }

    return specification;
}
