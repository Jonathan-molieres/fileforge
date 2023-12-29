'use client'
import { offersSearch } from '@/models/jobs/OfferSearch'
import Header from '@/app/(public)/_Header'
import { _ } from '@/utils/i18n'
import Typography from '@mui/material/Typography'
import OffersHeaderForm from './OfferHeaderForm'
import { observer } from 'mobx-react'
import React from 'react'
import CitySearch from '@/models/CitySearch'
import SectorSearch from '@/models/SectorSearch'
import { ConstructionOutlined } from '@mui/icons-material'

export default observer(function OffersHeader({
    searchParams,
    cities,
    sectors,
}: {
    searchParams: any
    cities: CitySearch
    sectors: SectorSearch
}) {
    const offers = offersSearch
    const isList = searchParams.offer ? false : true

    React.useEffect(() => {
        const combinedFilters = {
            keywords: searchParams.keywords || offers.filters?.keywords || '',
            sector: searchParams?.['sector[]'] || offers.filters?.sector || [],
            zipCodes: searchParams?.['zipCodes'] || offers.filters?.zipCodes || [],
            contractTypes: searchParams?.['contractTypes[]'] || offers.filters?.contractTypes || [],
            salaryRanges: searchParams?.['salaryRanges[]'] || offers.filters?.salaryRanges || [],
        }
        offers.setQuery(combinedFilters)
    }, [searchParams])

    return (
        <Header
            sx={{
                pt: '7.5rem',
                display: 'grid',
                gap: '1.5rem',
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    textAlign: 'center',
                }}
                color="primary.contrastText"
            >
                {(isList && _('Cherchez votre offre')) || _('Trouvez votre offre')}
            </Typography>
            <OffersHeaderForm
                offers={offers}
                searchParams={searchParams}
                cities={cities.rows}
                sectors={sectors}
            />
        </Header>
    )
})
