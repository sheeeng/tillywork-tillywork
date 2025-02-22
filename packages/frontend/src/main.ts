import App from './app/App.vue';

import router from './router';

import vuetify from './plugins/vuetify';
import posthog from './plugins/posthog';
import { VueQueryPlugin } from '@tanstack/vue-query';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import shortcutDirective from './directives/shortcut';

import BaseIconBtn from './components/common/base/BaseIconBtn.vue';
import BaseAvatar from './components/common/base/BaseAvatar.vue';
import BaseUserSelector from './components/common/inputs/BaseUserSelector/BaseUserSelector.vue';
import BaseDatePicker from './components/common/inputs/BaseDatePicker.vue';
import ListStageSelector from './components/common/inputs/ListStageSelector.vue';

import '@/styles/styles.scss';

const app = createApp(App);

app.component('BaseIconBtn', BaseIconBtn);
app.component('BaseAvatar', BaseAvatar);
app.component('BaseUserSelector', BaseUserSelector);
app.component('BaseDatePicker', BaseDatePicker);
app.component('ListStageSelector', ListStageSelector);

const pinia = createPinia();
// Adds router as a store plugin for each store
// can be used by this.$router.push('/')
// from inside the store
pinia.use(({ store }) => {
  store.$router = markRaw(router);
});
// Persist the store through page reload
// make sure to set persist: true in store
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(vuetify);
app.use(router);
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  },
});
app.use(posthog);

app.directive('shortcut', shortcutDirective);

app.mount('#root');
