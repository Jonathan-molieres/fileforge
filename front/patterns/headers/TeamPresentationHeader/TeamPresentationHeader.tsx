import Header from '@/app/(public)/_Header/Header'
import { _ } from '@/utils/i18n'
import Typography from '@mui/material/Typography'

export default function TeamPresentationHeader() {
    return (
        <Header
            sx={{
                display: 'grid',
                gap: '0.41rem',
            }}
            wrapperSx={{
                position: 'relative',
            }}
        >
            <Typography
                variant="h1"
                color="primary.contrastText"
                sx={{
                    textAlign: 'center',
                }}
            >
                {_('Qui sont les chasseurs de têtes de notre cabinet de recrutement')}
            </Typography>
            <Typography
                variant="body2"
                color="primary.contrastText"
                sx={{
                    textAlign: 'left',
                }}
            >
                {_(
                    'Work&You c’est un réseau d’agence et une équipe de 30 personnes, qui travaillent ensemble pour vous proposer recrutement, accompagnement RH et des formations sur-mesure.<br />Ces thèmes vous intéressent ? Rejoignez-nous >',
                    {
                        html: true,
                    }
                )}
            </Typography>
        </Header>
    )
}
