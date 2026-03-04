import { useCallback, useMemo } from "react";
import { Chip, Typography } from "@metrom-xyz/ui";
import type { AaveV3CampaignPayloadPart } from "@/src/types/campaign/aave-v3-campaign";
import { type AaveV3Protocol } from "@metrom-xyz/chains";
import type { AaveV3Collateral, AaveV3Market } from "@metrom-xyz/sdk";
import { useChainType } from "@/src/hooks/useChainType";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useAaveV3Collaterals } from "@/src/hooks/useAaveV3Collaterals";

import styles from "./styles.module.css";

interface AaveV3BlockCrossBorrowPickerProps {
    chainId?: number;
    brand?: AaveV3Protocol;
    market?: AaveV3Market;
    collateral?: AaveV3Collateral;
    value?: AaveV3Collateral[];
    onChange: (value: AaveV3CampaignPayloadPart) => void;
}

export function AaveV3BlockCrossBorrowPicker({
    chainId,
    brand,
    market,
    collateral,
    value,
    onChange,
}: AaveV3BlockCrossBorrowPickerProps) {
    const chainType = useChainType();
    const { loading, collaterals } = useAaveV3Collaterals({
        chainId,
        chainType,
        market: market?.address,
        brand: brand?.slug,
    });

    const availableCollaterals = useMemo(() => {
        if (!collaterals || !collateral) return [];
        return collaterals.filter(
            ({ address }) => address !== collateral.address,
        );
    }, [collaterals, collateral]);

    const getCollateralOnPickHandler = useCallback(
        (collateral: AaveV3Collateral) => {
            return () => {
                const existing = !!value?.find(
                    ({ address }) => address === collateral.address,
                );

                let newPickedCollaterals: AaveV3Collateral[] = [];
                if (existing)
                    newPickedCollaterals = value!.filter(
                        ({ address }) => address !== collateral.address,
                    );
                else newPickedCollaterals = [...(value || []), collateral];

                onChange({ blacklistedCollaterals: newPickedCollaterals });
            };
        },
        [value, onChange],
    );

    return (
        <div className={styles.root}>
            {loading ? (
                // TODO: aadd loading state
                <div>loading</div>
            ) : (
                availableCollaterals.map((collateral) => {
                    const active = !!value?.find(
                        ({ address }) => address === collateral.address,
                    );
                    return (
                        <Chip
                            key={collateral.address}
                            variant="secondary"
                            active={active}
                            onClick={getCollateralOnPickHandler(collateral)}
                        >
                            <div className={styles.collateral}>
                                <RemoteLogo
                                    address={collateral.address}
                                    chain={collateral.chainId}
                                    size="xxs"
                                />
                                <Typography size="sm" weight="medium">
                                    {collateral.symbol}
                                </Typography>
                            </div>
                        </Chip>
                    );
                })
            )}
        </div>
    );
}
