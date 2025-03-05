export function load(url, context, defaultLoad) {
    if (url.endsWith(".webp")) {
        return {
            format: "module",
            shortCircuit: true,
            source: 'export default "";',
        };
    }
    return defaultLoad(url, context, defaultLoad);
}
