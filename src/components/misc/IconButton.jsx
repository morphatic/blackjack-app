import { IconButton as MuiIconButton, SvgIcon } from '@material-ui/core'
import t from 'prop-types'

export const createIconButton = React => {
  const IconButton = ({ color, icon, onClick, size }) => (
    <MuiIconButton
      style={{ color }}
      onClick={onClick}
      size={size}
    >
      <SvgIcon><path d={icon} /></SvgIcon>
    </MuiIconButton>
  )

  IconButton.propTypes = {
    color: t.string,
    icon: t.string.isRequired,
    onClick: t.func.isRequired,
    size: t.string,
  }

  IconButton.defaultProps = {
    color: 'white',
    size: 'medium'
  }

  return IconButton
}

export default createIconButton