import { _ } from '@/utils/i18n'
import { Typography, Box, SxProps } from '@mui/material'
import Image, { StaticImageData } from 'next/image'

interface Item {
    image?: StaticImageData
    label?: string
    value?: string | number
    sx?: SxProps
}

export default function GreyPanel({ items }: { items: Item[] }) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: 'repeat(4, 1fr)',
                },
                backgroundColor: 'background.paper',
                p: '2rem',
                textAlign: 'center',
                gap: { xs: '2rem', sm: '2rem', md: 0 },
            }}
        >
            {items.map((item, index) => (
                <Item key={index} item={item} />
            ))}
        </Box>
    )
}

const Item = ({ item: { image, label, value, sx } }: { item: Item }) => {
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                '&:not(:last-child):after': {
                    content: '""',
                    position: 'absolute',
                    right: { xs: 'auto', sm: 0 },
                    top: { xs: 'auto', sm: '50%' },
                    bottom: { xs: '0px', sm: 'auto' },
                    transform: { xs: 'translateY(15px)', sm: 'translateY(-50%)' },
                    width: { xs: '1.3125rem', sm: '2px', md: '2px' },
                    height: { xs: '2px', sm: '2px', md: '1.3125rem' },
                    backgroundColor: 'secondary.main',
                },
                ...sx,
            }}
        >
            {image && (
                <Image
                    src={image.src}
                    alt={label ?? ''}
                    width={image.width ?? 85}
                    height={image.height ?? 71}
                    layout="fixed"
                />
            )}
            <Typography variant="body1">{label}</Typography>
            <Typography variant="body1" sx={{ color: 'secondary.main' }}>
                {value}
            </Typography>
        </Box>
    )
}
