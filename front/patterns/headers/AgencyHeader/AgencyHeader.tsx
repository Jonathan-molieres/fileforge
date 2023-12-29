import Header from '@/app/(public)/_Header/Header'
import { _ } from '@/utils/i18n'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import Agen from '../images/agen.png'

export default function AgencyHeader() {
    return (
        <Header
            sx={{
                py: 7.5,
                display: 'grid',
                gap: '0.41rem',
            }}
            wrapperSx={{
                position: 'relative',
            }}
        >
            <Image
                src={Agen.src}
                width={Agen.width}
                height={Agen.height}
                priority
                alt="ville de Agen"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                layout="responsive"
            />
            <Typography
                variant="h1"
                color="primary.contrastText"
                sx={{
                    textAlign: 'center',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {_('Cabinet de recrutement')}
                <br />
                {_('Agen')}
            </Typography>
        </Header>
    )
}
