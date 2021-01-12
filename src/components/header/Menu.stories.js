import { CssBaseline } from '@material-ui/core'
import React from 'react'
import createHeaderMenu from './Menu'

const HeaderMenu = createHeaderMenu(React)

const story = {
  title: 'Header/Menu',
  component: HeaderMenu,
  argTypes: {
    isLoggedIn: {
      type: {
        name: 'boolean',
        required: true
      },
      defaultValue: false,
      control: {
        type: 'inline-radio',
        options: [false, true],
      }
    }
  },
  description:
    'The **HeaderMenu** contains two buttons to log out and open the ' +
    'preferences pane.'
}

const Template = ({ isLoggedIn }) => <div><CssBaseline /><HeaderMenu isLoggedIn={isLoggedIn} /></div>

export const Primary = Template.bind({})

export default story
