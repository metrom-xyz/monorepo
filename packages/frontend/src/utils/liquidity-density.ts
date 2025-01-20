import type { ScaledLiquidityTick } from "../components/liquidity-density-chart";

export function zoom(
    ticks: ScaledLiquidityTick[],
    activeTickIdx: number,
    zoomLevel: number,
    baseZoomFactor: number,
) {
    if (zoomLevel === 0) return ticks;

    const zoomFactor = Math.max(baseZoomFactor / zoomLevel, 1);

    // TODO: check if it's possible to calculate the index of the active
    // tick in the ticks array by considering the idx of the first element
    // of the array and the currently active idx in the pool
    const activeTickIndex = ticks.findIndex((tick) => {
        return tick.idx === activeTickIdx;
    });
    if (activeTickIndex < 0) return [];

    const sliceStart = Math.max(activeTickIndex - Math.floor(zoomFactor), 0);
    const sliceEnd = Math.min(
        activeTickIndex + Math.ceil(zoomFactor),
        ticks.length,
    );

    return ticks.slice(sliceStart, sliceEnd);
}

export function closestTick(ticks: ScaledLiquidityTick[], tick: number) {
    return ticks.reduce(
        (closest: number, current) =>
            Math.abs(current.idx - tick) < Math.abs(closest - tick)
                ? current.idx
                : closest,
        0,
    );
}
