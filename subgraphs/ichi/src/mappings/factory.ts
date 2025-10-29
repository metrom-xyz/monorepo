import { ICHIVaultCreated } from "../../generated/Factory/Factory";
import { Vault } from "../../generated/schema";
import { Vault as VaultTemplate } from "../../generated/templates";
import { Vault as VaultContract } from "../../generated/templates/Vault/Vault";
import { BI_0 } from "../commons";

export function handleVaultCreated(event: ICHIVaultCreated): void {
    const pool = VaultContract.bind(event.params.ichiVault).pool();

    const vault = new Vault(event.params.ichiVault);
    vault.pool = pool;
    vault.liquidity = BI_0;
    vault.save();

    VaultTemplate.create(event.params.ichiVault);
}
