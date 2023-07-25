import { createApp } from 'vue';
import App from './App.vue';''
import { createI18n } from 'vue-i18n';


// Obtient la langue par défaut du système d'exploitation
// const defaultLocale = navigator.locale;

const i18n = createI18n({
  locale: 'en', // Langue par défaut
  fallbackLocale: 'en', // Langue de secours si la langue demandée n'est pas disponible
  messages: {
    fr: require('./trads-fr.json'),
    en: require('./trads-en.json')
  }
});

createApp(App)
.use(i18n)
.mount('#app');
