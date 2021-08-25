import i18next from 'i18next'

export const initializeI18n = async() => await i18next.init({
  lng: navigator.language.split('-')[0],
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        controllerMessage: 'Sync raise hand',
      },
    },
    ja: {
      translation: {
        controllerMessage: '挙手を同期する',
      },
    },
  },
})
