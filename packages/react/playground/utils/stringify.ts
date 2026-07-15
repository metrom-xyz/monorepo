export function stringify(value: unknown): string {
    return JSON.stringify(
        value,
        (_key, value) => (typeof value === "bigint" ? `${value}n` : value),
        2,
    );
}
