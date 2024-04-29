import { ref, watch, type Ref } from "vue";
import { useRoute } from "vue-router";

export function useSelectedChain(): Ref<number | undefined> {
    const route = useRoute();

    const network = ref<number | undefined>();

    watch(
        route,
        (route) => {
            network.value = Number(route.query["chain"]?.toString());
        },
        { immediate: true },
    );

    return network;
}
