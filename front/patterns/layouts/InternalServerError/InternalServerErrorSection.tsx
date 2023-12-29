import { Button, Typography } from '@mui/material'
import { _ } from '@/utils/i18n'
import InternalServerError from './InternalServerError.gif'
import Image from 'next/image'
import Section from '../../../app/(public)/_Section'
import Link from 'next/link'

interface NotFoundProps {}

export default function NotFoundSection({}: NotFoundProps) {
    return (
        <Section
            sx={{
                display: 'grid',
                gridTemplateColumns: '100%',
                gap: '20px',
                alignContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
            }}
        >
            <Image src={InternalServerError} alt="Erreur 404" style={{ margin: '0 auto' }} />
            <Typography variant="h2" color="primary">
                {_(
                    'Vous voyez cette Erreur 500 car cette page est <br> temporairement indisponible.',
                    { html: true }
                )}
            </Typography>
            <Button
                component={Link}
                variant="outlined"
                color="primary"
                href="/"
                sx={{ margin: '0 auto' }}
            >
                {_('Retournez sur la page d’accueil')}
            </Button>
        </Section>
    )
}
