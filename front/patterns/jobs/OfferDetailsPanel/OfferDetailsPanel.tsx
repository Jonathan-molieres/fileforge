import { secondary } from '@/themes/constants'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import Copy from './icons/copy.svg'
import Julia from './icons/julia.png'
import Offer from '@/models/jobs/Offer'

export default function OfferView({ selectedOffer }: { selectedOffer: Offer }) {
    const offer = selectedOffer

    return (
        <Box
            sx={{
                display: 'flex',
                gridArea: 'offer',
                flexDirection: 'column',
                justifyItems: 'flex-start',
                alignItems: 'flex-start',
                gap: '1.31rem',
                animation: {
                    xs: 'none',
                    md: 'slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
                },
                '@keyframes slide-in-right ': {
                    '0%': {
                        transform: 'translateX(1000px)',
                        opacity: '0',
                    },
                    '100%': {
                        transform: 'translateX(0)',
                        opacity: '1',
                    },
                },
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    alignItems: 'flex-start',
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '1.31rem',
                    }}
                >
                    <Typography variant="h3" color="primary">
                        {offer?.name}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        {offer?.locationCity}&nbsp;
                        <span
                            style={{
                                color: secondary,
                            }}
                        >
                            |
                        </span>
                        &nbsp;
                        {offer?.getSalaire}&nbsp;
                        <span
                            style={{
                                color: secondary,
                            }}
                        >
                            |
                        </span>
                        &nbsp;
                        {offer?.contractType}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        justifyItems: 'flex-end',
                    }}
                >
                    <Image src={Julia} alt="julia" width={Julia.width} height={Julia.height} />
                    <Typography variant="h4" color="primary">
                        Julia
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                    gridTemplateAreas: `'button button copy copy copy copy copy copy'`,
                    alignItems: 'center',
                    gap: '0.63rem',
                    justifyItems: 'start',
                }}
            >
                <Button
                    size="large"
                    sx={{
                        width: '100%',
                        backgroundColor: secondary,
                        gridArea: 'button',
                    }}
                >
                    Je postule
                </Button>
                <Box
                    sx={{
                        gridArea: 'copy',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyItems: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <Image src={Copy.src} alt="copy" width={Copy.width} height={Copy.height} />
                    <Typography
                        variant="body2"
                        color="primary"
                        sx={{
                            fontSize: '0.625rem',
                            fontWeight: '500',
                            textAlign: 'center',
                        }}
                    >
                        Copier
                    </Typography>
                </Box>
            </Box>
            <Typography
                variant="body2"
                color="primary"
                dangerouslySetInnerHTML={{ __html: offer?.description || '' }}
            />
        </Box>
    )
}
