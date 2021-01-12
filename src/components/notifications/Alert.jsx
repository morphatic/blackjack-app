import { useState } from "react"
import t from 'prop-types'
import { IconButton, SvgIcon, Zoom } from '@material-ui/core'
import { Alert as MuiAlert, AlertTitle } from '@material-ui/lab'
import { mdiClose } from '@mdi/js'

/**
 * Creates an alert message
 */
const createAlert =  React => {
  const Alert = ({ message, severity, title }) => {
    const [alert, setAlert] = useState(message)
    return (
      <Zoom in={!!alert}>
        <MuiAlert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {setAlert('')}}
            >
              <SvgIcon><path d={mdiClose} /></SvgIcon>
            </IconButton>
          }
          severity={severity}
          variant="filled"
        >
          <AlertTitle>{title}</AlertTitle>
          {alert}
        </MuiAlert>
      </Zoom>
    )
  }

  Alert.propTypes = {
    message: t.string,
    severity: t.string,
    title: t.string,
  }

  return Alert
}

export default createAlert
