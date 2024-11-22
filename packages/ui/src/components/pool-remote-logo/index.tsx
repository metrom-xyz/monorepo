import styles from "./styles.module.css";
import {
    RemoteLogo,
    type RemoteLogoProps,
    type RemoteLogoSize,
} from "../remote-logo";
import classNames from "classnames";

export interface PoolRemoteLogoProps {
    loading?: boolean;
    size?: RemoteLogoSize;
    chain?: number;
    tokens: Omit<RemoteLogoProps, "size" | "chain">[];
    className?: {
        root?: string;
    };
}

export function PoolRemoteLogo({
    loading,
    size = "base",
    chain,
    tokens,
    className,
}: PoolRemoteLogoProps) {
    return (
        <div
            className={classNames(styles.root, className?.root, {
                [styles[size]]: true,
            })}
        >
            {tokens.map((token) => {
                return (
                    <RemoteLogo
                        key={token.address}
                        loading={loading}
                        chain={chain}
                        size={size}
                        {...token}
                        defaultText={token?.defaultText}
                    />
                );
            })}
        </div>
    );
}
