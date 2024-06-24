export interface TextSizes {
    xs?: boolean;
    sm?: boolean;
    lg?: boolean;
    xl?: boolean;
    h1?: boolean;
    h2?: boolean;
    h3?: boolean;
    h4?: boolean;
}

export interface TypographyProps extends TextSizes {
    bold?: boolean;
    medium?: boolean;
    uppercase?: boolean;
}
