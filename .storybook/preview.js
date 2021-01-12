import { I18nextProvider } from 'react-i18next'
import { withContexts } from '@storybook/addon-contexts/react'
import { contexts } from './contexts'
import i18n from '../src/i18n'

export const globalTypes = {
  locale: {
    name: 'Locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        {
          value: 'en',
          title: 'English',
        },
        {
          value: 'jp',
          title: '日本語 (Japanese)',
        },
      ],
    },
  },
}

const I18nextDecorator = (Story, { globals }) => {
  i18n.changeLanguage(globals.locale)
  return (
    <I18nextProvider i18n={i18n}>
      <Story />
    </I18nextProvider>
  )
}

export const decorators = [
  // I18nextDecorator,
  withContexts(contexts),
]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
