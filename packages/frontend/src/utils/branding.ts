import type { ProjectBranding } from "../types/project";

export function relativeLuminance(hex: string): number {
    const [r, g, b] = hexToRgb(hex).map((v) => {
        const c = v / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace(/^#/, "").slice(0, 6);
    return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16),
    ];
}

function hexToHsl(hex: string): [number, number, number] {
    const [r, g, b] = hexToRgb(hex).map((v) => v / 255) as [
        number,
        number,
        number,
    ];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
    const sn = s / 100;
    const ln = l / 100;
    const a = sn * Math.min(ln, 1 - ln);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function mixWithWhite(hex: string, mainRatio: number): string {
    const [r, g, b] = hexToRgb(hex);
    const blend = (c: number) =>
        Math.round(c * mainRatio + 255 * (1 - mainRatio))
            .toString(16)
            .padStart(2, "0");
    return `#${blend(r)}${blend(g)}${blend(b)}`;
}

export function generateBranding(
    main: string,
): Omit<ProjectBranding, "iconBackground"> {
    const [h, s] = hexToHsl(main);

    return {
        main,
        light: mixWithWhite(main, 0.2),
        contrast: {
            light: mixWithWhite(main, 0.1),
            dark: hslToHex(h, s * 0.6, 12),
        },
    };
}
