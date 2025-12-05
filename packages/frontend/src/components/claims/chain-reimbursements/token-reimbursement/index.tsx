import classNames from "classnames";
import { Button, Skeleton } from "@metrom-xyz/ui";
import type { TokenReimbursements } from "..";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { Erc20Token } from "@metrom-xyz/sdk";
import { APTOS } from "@/src/commons/env";
import { TokenReimbursementEvm } from "./token-reimbursement-evm";
import { TokenReimbursementMvm } from "./token-reimbursement-mvm";

import styles from "./styles.module.css";

export interface TokenReimbursementProps {
    chainId: number;
    tokenReimbursements: TokenReimbursements;
    recoveringAll?: boolean;
    onRecover: (token: Erc20Token) => void;
}

export function TokenReimbursement(props: TokenReimbursementProps) {
    if (APTOS) return <TokenReimbursementMvm {...props} />;
    return <TokenReimbursementEvm {...props} />;
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
