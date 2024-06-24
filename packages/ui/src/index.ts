import { type App } from "vue";

import MetAccordion from "./components/accordion/MetAccordion.vue";
import MetAccordionSummary from "./components/accordion/summary/MetAccordionSummary.vue";
import MetAccordionSelect from "./components/accordion-select/MetAccordionSelect.vue";
import MetAccordionSelectOption from "./components/accordion-select/option/MetAccordionSelectOption.vue";
import MetAvatar from "./components/avatar/MetAvatar.vue";
import MetBalance from "./components/balance/MetBalance.vue";
import MetButton from "./components/button/MetButton.vue";
import MetCard from "./components/MetCard.vue";
import MetChip from "./components/chip/MetChip.vue";
import MetDateInput from "./components/date-input/MetDateInput.vue";
import MetDateRangeInput from "./components/date-range-input/MetDateRangeInput.vue";
import MetEns from "./components/ens/MetEns.vue";
import MetErrorText from "./components/error-text/MetErrorText.vue";
import MetListInput from "./components/list-input/MetListInput.vue";
import MetModal from "./components/modal/MetModal.vue";
import MetNumberInput from "./components/MetNumberInput.vue";
import MetPairRemoteLogo from "./components/pair-remote-logo/MetPairRemoteLogo.vue";
import MetPoolSelect from "./components/pool-select/MetPoolSelect.vue";
import MetPopover from "./components/popover/MetPopover.vue";
import MetProgressBar from "./components/progress-bar/MetProgressBar.vue";
import MetRemoteLogo from "./components/remote-logo/MetRemoteLogo.vue";
import MetSelect from "./components/select/MetSelect.vue";
import MetSkeleton from "./components/skeleton/MetSkeleton.vue";
import MetStepper from "./components/stepper/MetStepper.vue";
import MetStep from "./components/stepper/step/MetStep.vue";
import MetStepPreview from "./components/stepper/step-preview/MetStepPreview.vue";
import MetSwitch from "./components/switch/MetSwitch.vue";
import MetTabs from "./components/tabs/MetTabs.vue";
import MetTab from "./components/tabs/tab/MetTab.vue";
import MetTextField from "./components/text-field/MetTextField.vue";
import MetTextInput from "./components/MetTextInput.vue";
import MetTokenSelect from "./components/token-select/MetTokenSelect.vue";
import MetTypography from "./components/typography/MetTypography.vue";
import MetWarningMessage from "./components/MetWarningMessage.vue";

export * from "./types";
export { filterPools } from "./utils/tokens";

export {
    MetAccordion,
    MetAccordionSummary,
    MetAccordionSelect,
    MetAccordionSelectOption,
    MetAvatar,
    MetBalance,
    MetButton,
    MetCard,
    MetChip,
    MetDateInput,
    MetDateRangeInput,
    MetEns,
    MetErrorText,
    MetListInput,
    MetModal,
    MetNumberInput,
    MetPairRemoteLogo,
    MetPoolSelect,
    MetPopover,
    MetProgressBar,
    MetRemoteLogo,
    MetSelect,
    MetSkeleton,
    MetStepper,
    MetStep,
    MetStepPreview,
    MetSwitch,
    MetTabs,
    MetTab,
    MetTextField,
    MetTextInput,
    MetTokenSelect,
    MetTypography,
    MetWarningMessage,
};

export interface PluginOptions {
    injectComponents?: boolean;
}

const MetromVueUi = {
    install(app: App, options?: PluginOptions) {
        if (!options) return;

        if (options.injectComponents) {
            app.component("MetAccordion", MetAccordion);
            app.component("MetAccordionSummary", MetAccordionSummary);
            app.component("MetAccordionSelect", MetAccordionSelect);
            app.component("MetAccordionSelectOption", MetAccordionSelectOption);
            app.component("MetAvatar", MetAvatar);
            app.component("MetBalance", MetBalance);
            app.component("MetButton", MetButton);
            app.component("MetCard", MetCard);
            app.component("MetChip", MetChip);
            app.component("MetDateInput", MetDateInput);
            app.component("MetDateRangeInput", MetDateRangeInput);
            app.component("MetEns", MetEns);
            app.component("MetErrorText", MetErrorText);
            app.component("MetListInput", MetListInput);
            app.component("MetModal", MetModal);
            app.component("MetNumberInput", MetNumberInput);
            app.component("MetPairRemoteLogo", MetPairRemoteLogo);
            app.component("MetPoolSelect", MetPoolSelect);
            app.component("MetPopover", MetPopover);
            app.component("MetProgressBar", MetProgressBar);
            app.component("MetRemoteLogo", MetRemoteLogo);
            app.component("MetSelect", MetSelect);
            app.component("MetSkeleton", MetSkeleton);
            app.component("MetStepper", MetStepper);
            app.component("MetStep", MetStep);
            app.component("MetStepPreview", MetStepPreview);
            app.component("MetSwitch", MetSwitch);
            app.component("MetTabs", MetTabs);
            app.component("MetTab", MetTab);
            app.component("MetTextField", MetTextField);
            app.component("MetTextInput", MetTextInput);
            app.component("MetTokenSelect", MetTokenSelect);
            app.component("MetTypography", MetTypography);
            app.component("MetWarningMessage", MetWarningMessage);
        }
    },
};

export default MetromVueUi;
