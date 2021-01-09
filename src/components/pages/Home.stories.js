import React from 'react'

import createHomePage from './Home'

const HomePage = createHomePage(React)

const story = {
  title: 'Pages/Home Page',
  component: HomePage,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  description:
    'The **Home Page** is a simple page with a jumbo banner ' +
    'with the app name and a simple login form that uses a ' +
    'Magic link.'
}

const Template = (args) => <HomePage {...args} />

export const Primary = Template.bind({})
// Primary.args = {
//   primary: true,
//   label: 'Home',
// }


export default story
