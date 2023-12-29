'use client'
import OfferSearch from '@/models/jobs/OfferSearch'
import { _ } from '@/utils/i18n'
import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image'
import Filters from '../images/filters.svg'
import { useRouter } from 'next/navigation'
import { observer } from 'mobx-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default observer(function OffersHeaderFormAction({
    offers,
    isCollapse,
}: {
    offers: OfferSearch
    isCollapse: boolean
}) {
    const router = useRouter()
    const handleCollapse = () => {
        offers.toggleCollapsed()
    }

    const handleSearch = () => {
        const hrefLink = offers.filterToSearchParams() as string
        router.replace(hrefLink, { scroll: false })
    }

    return (
        <Box
            sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr',
                justifyContent: 'center',
                gap: '0.62rem',
            }}
        >
            {isCollapse && (
                <Typography
                    variant="button"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.contrastText',
                        cursor: 'pointer',
                    }}
                    onClick={handleCollapse}
                >
                    <Image src={Filters.src} alt="Filters" width={20} height={20} />
                    &nbsp;&nbsp;Recherche avancée
                </Typography>
            )}
            <Button
                color="primary"
                sx={{
                    p: '0.75rem 5.5rem',
                    m: 'auto',
                }}
                onClick={handleSearch}
            >
                {_('Rechercher')}
            </Button>
        </Box>
    )
})
