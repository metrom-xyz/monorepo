import type {
    Messages,
    NamespaceKeys,
    NestedKeyOf,
    useTranslations,
} from "next-intl";
import type { getTranslations } from "next-intl/server";

export type TranslationsType<
    T extends NamespaceKeys<Messages, NestedKeyOf<Messages>>,
> =
    | Awaited<ReturnType<typeof getTranslations<T>>>
    | ReturnType<typeof useTranslations<T>>;

export type TranslationsKeys<
    T extends NamespaceKeys<Messages, NestedKeyOf<Messages>>,
> = Parameters<TranslationsType<T>>[0];

export type LocalizedMessage<
    T extends NamespaceKeys<Messages, NestedKeyOf<Messages>>,
> = TranslationsKeys<T> | "";

export type PropertyUnion<T> = {
    [K in keyof T]: { [P in K]: T[K] };
}[keyof T];
