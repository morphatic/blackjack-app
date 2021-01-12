import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { Box, makeStyles } from "@material-ui/core"
import { GameStateContext } from "../../contexts/GameContext"

const drw = 50 // dealer rules text

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    // top: `calc(45vh - ${iw * iar / 2}vw)`,
    top: '25vh',
    width: `${drw}vw`,
    left: `calc(50vw - ${drw / 2}vw)`,
  },
})

const createDealerRules = React => () => {
  const { t } = useTranslation()
  const game = useContext(GameStateContext)
  const [rule] = useState(game.rules.dealerStandsOnSoft17)
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 704.81 217">
        <path id="curve" style={{ fill: 'none' }} d="M0,0S82.27,215.48,352.41,217,704.81,4.46,704.81,4.46"/>
        <text width="704.81" style={{ fill: '#dba437', fontFamily: 'Raleway, sans-serif', fontSize: '2rem', textAnchor: 'middle' }}>
          <textPath href="#curve" startOffset="50%">
            {t(`misc.dealer-rules.${rule ? 'stand' : 'hit'}`)}
          </textPath>
        </text>
      </svg>
    </Box>
  )
}

export default createDealerRules
