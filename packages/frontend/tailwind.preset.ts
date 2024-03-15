import { type Config } from "tailwindcss";

const fontSizeToHeight = (size: string, percentage: number) =>
    `${Number(size.replace("rem", "")) * percentage}rem`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTypographyConfig = (variant: string, theme: any) => {
    const h1FontSize = theme("fontSize.h1");
    const h2FontSize = theme("fontSize.h2");
    const h3FontSize = theme("fontSize.h3");
    const h4FontSize = theme("fontSize.h4");
    const headingFontFamily = theme("fontFamily.sans");

    const bodyFontSize = theme(`fontSize.${variant}`);
    const bodyFontFamily = theme("fontFamily.mono");

    return {
        css: {
            maxWidth: "100%",
            h1: {
                fontSize: h1FontSize[0],
                fontFamily: headingFontFamily,
                marginTop: "1.75rem",
                marginBottom: "1.5rem",
                height: theme("height.h1"),
                ...h1FontSize[1],
            },
            h2: {
                fontSize: h2FontSize[0],
                fontFamily: headingFontFamily,
                marginTop: "1.5rem",
                marginBottom: "1rem",
                height: theme("height.h2"),
                ...h2FontSize[1],
            },
            h3: {
                fontSize: h3FontSize[0],
                fontFamily: headingFontFamily,
                marginTop: "1rem",
                marginBottom: "0.5rem",
                height: theme("height.h3"),
                ...h3FontSize[1],
            },
            h4: {
                fontSize: h4FontSize[0],
                fontFamily: headingFontFamily,
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                height: theme("height.h4"),
                ...h4FontSize[1],
            },
            p: {
                fontSize: bodyFontSize,
                fontFamily: bodyFontFamily,
                lineHeight: "146%",
            },
            li: {
                fontSize: bodyFontSize,
                fontFamily: bodyFontFamily,
                lineHeight: "146%",
            },
        },
    };
};

export default {
    darkMode: ["class", '[class~="dark"]'],
    plugins: [],
    theme: {
        fontFamily: {
            inter: ["Inter", "sans-serif"],
            // mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
        },
        colors: {
            // primary
            orange: "#EF692B",
            green: "#6CFF95",
            // secondary
            "orange-dark": "#D6602A",
            "green-dark": "#359650",
            yellow: "#F6FB18",
            "sky-blue": "#22BDD5",
            blue: "#0029FF",
            magenta: "#CF2CF6",
            pink: "#EA33A8",
            red: "#EA392A",
            // neutrals
            transparent: "transparent",
            current: "currentColor",
            white: "#ffffff",
            black: "#000000",
            gray: {
                // 400: "#E7E7E7",
                // 300: "#656363",
                // 200: "#F8F7FC",
                // 100: "#E6E6E6",

                400: "#656363",
                300: "#F8F7FC",
                200: "#E6E6E6",
                100: "#E7E7E7",
                // 700: "#272727",
                // 600: "#616161",
                // 500: "#828282",
                // 400: "#B3B3B3",
                // 300: "#CBCBCB",
                // 200: "#E9E9E9",
                // 100: "#F6F6F6",
            },
        },
        fontSize: {
            xs: "0.75rem",
            sm: "0.85rem",
            base: "1rem",
            lg: "1.188rem",
            xl: "1.5rem",
            h1: [
                "3.5rem",
                {
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "124%",
                },
            ],
            h2: [
                "2.25rem",
                {
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "124%",
                },
            ],
            h3: [
                "1.5rem",
                {
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "124%",
                },
            ],
            h4: [
                "1.3125rem",
                {
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                    lineHeight: "124%",
                },
            ],
        },
        extend: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            height({ theme }: { theme: any }) {
                return {
                    xs: fontSizeToHeight(theme("fontSize.xs"), 1.46),
                    sm: fontSizeToHeight(theme("fontSize.sm"), 1.46),
                    base: fontSizeToHeight(theme("fontSize.base"), 1.46),
                    lg: fontSizeToHeight(theme("fontSize.lg"), 1.46),
                    xl: fontSizeToHeight(theme("fontSize.xl"), 1.46),
                    h4: fontSizeToHeight(theme("fontSize.h4")[0], 1.24),
                    h3: fontSizeToHeight(theme("fontSize.h3")[0], 1.24),
                    h2: fontSizeToHeight(theme("fontSize.h2")[0], 1.24),
                    h1: fontSizeToHeight(theme("fontSize.h1")[0], 1.24),
                };
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typography({ theme }: { theme: any }) {
                return {
                    xs: getTypographyConfig("xs", theme),
                    sm: getTypographyConfig("sm", theme),
                    base: getTypographyConfig("base", theme),
                    DEFAULT: getTypographyConfig("base", theme),
                    lg: getTypographyConfig("lg", theme),
                    xl: getTypographyConfig("xl", theme),
                };
            },
            borderRadius: {
                xxl: "16px",
            },
            backgroundSize: {
                2: "2rem 2rem",
                3: "3.1rem 3.1rem",
                4: "4rem 4rem",
            },
            backgroundImage: {
                dots:
                    "radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.8px, transparent 1px), " +
                    "radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.8px, transparent 1px)",
            },
        },
    },
} as Omit<Config, "content">;
