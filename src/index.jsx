import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider/*, makeStyles */ } from '@material-ui/core/styles'
// import { makeStyles } from '@material-ui/core/styles'
import createApp from './App'
import theme from './theme'
// import reportWebVitals from './reportWebVitals';
// const useStyles = makeStyles({
//   root: {
//     background: 'radial-gradient(circle, rgba(53,101,77,1) 56%, rgba(27,71,49,1) 100%)',
//   },
// })
// const classes = useStyles()


const App = createApp(React)

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
    {/* <App className={classes.root} /> */}
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
