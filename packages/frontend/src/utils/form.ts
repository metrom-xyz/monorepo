export function allFieldsFilled<T extends object, K extends keyof T>(
    source: T,
    fields: K[],
) {
    return fields.every((field) => !!source[field]);
}
