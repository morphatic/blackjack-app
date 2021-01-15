import { Button as MuiButton } from '@material-ui/core'

export const createButton = React => {
  const Button = (props) => (
    <MuiButton
      className={props.className}
      endIcon={props.endIcon}
      onClick={props.onClick}
      size={props.size || 'large'}
      style={{
        backgroundColor: 'black',
        color: 'white',
        fontFamily: 'Raleway, sans-serif',
        fontSize: '2rem',
        margin: '1rem',
        paddingLeft: '2.5rem',
        paddingRight: '2.5rem',
        '& .MuiSvgIconRoot': {
          height: '2rem',
          marginLeft: '0.5rem',
          width: '2rem',
        },
        '&:hover': {
          backgroundColor: '#030',
          color: '#fbc02d',
        },
        ...props.style,
      }}
      type={props.type || 'button'}
      variant="contained"
    >
      {props.children}
    </MuiButton>
  )

  return Button
}

export default createButton
