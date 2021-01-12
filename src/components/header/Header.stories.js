import { CssBaseline } from '@material-ui/core'
import React from 'react'
import createHeader from './Header'

const Header = createHeader(React)

const story = {
  title: 'Header/Header',
  component: Header,
  argTypes: {
    // backgroundColor: { control: 'color' },
    isLoggedIn: {
      type: Boolean,
      control: {
        defaultValue: false,
        type: 'inline-radio',
        options: [false, true],
      }
    }
  },
  description:
    'The **Header** contains the site name and logo as well ' +
    'as settings, profile, and logout links when the user is ' +
    'logged in.'
}

const Template = ({ isLoggedIn }) => <div><CssBaseline /><Header isLoggedIn={isLoggedIn} /></div>

export const Primary = Template.bind({})

export default story
