<script setup lang="ts">
import FormPreviewImage from "./assets/FormPreviewImage.vue";
import MetromLogo from "./assets/MetromLogo.vue";
import TelegramLogo from "./assets/TelegramLogo.vue";
import XLogo from "./assets/XLogo.vue";
import { METROM_TELEGRAM, METROM_X_ACCOUNT } from "./common";
</script>
<template>
    <div class="app__container">
        <div class="app__content">
            <div class="app__copy">
                <MetromLogo />
                <h2 class="app__title__text">{{ $t("landing.title") }}</h2>
                <h3 class="app__description__text">
                    {{ $t("landing.description") }}
                </h3>
                <div class="app__socials">
                    <a
                        :href="METROM_TELEGRAM"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <TelegramLogo />
                    </a>
                    <a
                        :href="METROM_X_ACCOUNT"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <XLogo />
                    </a>
                </div>
            </div>
            <div>
                <FormPreviewImage
                    class="w-full h-4/5 md:w-[453px] md:h-[979px]"
                />
            </div>
        </div>
        <footer class="app__footer">
            <p class="app__footer__text">
                <i18n-t keypath="landing.powered" for="landing.carrot">
                    <b>{{ $t("landing.carrot") }}</b>
                </i18n-t>
            </p>
        </footer>
    </div>
</template>
<style>
.app__container {
    @apply min-h-screen flex flex-col gap-14 items-center md:items-start px-2.5 lg:px-16 xl:px-[23%] py-3 md:py-9 bg-gray-300 bg-3 bg-dots;
}

.app__content {
    @apply flex flex-col flex-grow items-center md:items-start md:flex-row gap-11;
}

.app__copy {
    @apply flex flex-col gap-5;
}

.app__title__text {
    @apply text-h2 font-inter font-bold mt-7;
}

.app__description__text {
    @apply text-h3 font-inter;
}

.app__socials {
    @apply flex gap-2;
}

.app__footer__text {
    @apply font-inter uppercase;
}
</style>
