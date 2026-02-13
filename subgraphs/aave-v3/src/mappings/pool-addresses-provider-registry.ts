import {
    AddressesProviderRegistered,
    AddressesProviderUnregistered,
} from "../../generated/PoolAddressesProviderRegistry/PoolAddressesProviderRegistry";
import { Pool } from "../../generated/schema";
import { PoolAddressesProvider } from "../../generated/templates";

export function handleAddressesProviderRegistered(
    event: AddressesProviderRegistered,
): void {
    const address = event.params.addressesProvider;
    if (Pool.load(address) == null) {
        const pool = new Pool(address);
        pool.active = true;
        pool.save();

        PoolAddressesProvider.create(address);
    }
}

export function handleAddressesProviderUnregistered(
    event: AddressesProviderUnregistered,
): void {
    let address = event.params.addressesProvider;
    let pool = Pool.load(address);
    if (pool !== null) {
        pool.active = false;
        pool.save();
    }
}
