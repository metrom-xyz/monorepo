import classNames from "classnames";
import { Button, Skeleton } from "@metrom-xyz/ui";
import type { TokenReimbursements } from "..";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ChainType } from "@metrom-xyz/sdk";
import { TokenReimbursementEvm } from "./token-reimbursement-evm";
import { TokenReimbursementMvm } from "./token-reimbursement-mvm";
import { useChainType } from "@/src/hooks/useChainType";
import { TokenReimbursementSvm } from "./token-reimbursement-svm";

import styles from "./styles.module.css";

export interface TokenReimbursementProps {
    chainId: number;
    tokenReimbursements: TokenReimbursements;
    recoveringAll?: boolean;
    onRecover: () => void;
}

export function TokenReimbursement(props: TokenReimbursementProps) {
    const chainType = useChainType();

    switch (chainType) {
        case ChainType.Evm:
            return <TokenReimbursementEvm {...props} />;
        case ChainType.Aptos:
            return <TokenReimbursementMvm {...props} />;
        case ChainType.Svm:
            return <TokenReimbursementSvm {...props} />;
        default:
            return null;
    }
}

export function SkeletonTokenReimbursement() {
    return (
        <div className={classNames(styles.root)}>
            <div className={styles.leftWrapper}>
                <RemoteLogo loading />
                <Skeleton width={60} size="lg" />
                <div className={styles.amountWrapper}>
                    <Skeleton width={70} size="lg" />
                    <Skeleton width={40} size="sm" />
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                loading
                iconPlacement="right"
            />
        </div>
    );
}
