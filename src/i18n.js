import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const getResources = () => {
  // get all of the [lang].json files from the ./locales directory
  const locales = require.context('./locales', false, /[A-Za-z0-9-_,\s]+\.json$/i)
  // initialize an empty resources object
  const resources = {}
  // for each of the files
  locales.keys().forEach(key => {
    // extract the abbreviation for the locale from the filename
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    // and add the locale messages to the resources object
    if (matched && matched.length > 1) {
      const locale = matched[1]
      resources[locale] = {
        translation: locales(key)
      }
    }
  })
  return resources
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'jp'],
    interpolation: {
      escapeValue: false,
    },
    resources: getResources()
  })

export default i18n
