import { type Placement, type OffsetOptions } from "@floating-ui/vue";

export interface PopoverProps {
    placement?: Placement;
    offset?: OffsetOptions;
    open?: boolean;
}
