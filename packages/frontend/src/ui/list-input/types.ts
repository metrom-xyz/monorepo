export type ItemType = string | number;

export interface ListItem<V extends ItemType> {
    label: string;
    value: V;
}

export interface ListInputProps<V extends ListItem<ItemType>> {
    items: V[];
    messages: {
        placeholder: string;
        button: string;
    };
    max?: number;
    validate?: (item: ItemType) => boolean;
}
