'use client'

import OfferSearch from '@/models/jobs/OfferSearch'
import { _ } from '@/utils/i18n'
import { observer } from 'mobx-react-lite'
import TextField from '../TextField'
import Search from '../images/search.svg'
import Box from '@mui/material/Box'
import City from '@/models/City'
import SectorSearch from '@/models/SectorSearch'
import Autocomplete from '../Autocomplete'

export default observer(function OffersHeaderCollapsedForm({
    offers,
    searchParams,
    cities,
    sectors,
}: {
    offers: OfferSearch
    searchParams: any
    cities: City[]
    sectors: SectorSearch
}) {
    const autocompleteCities = cities?.map((city) => {
        return { label: city.name, value: city?.code }
    })

    const autocompleteSectors = sectors?.rows?.map((sector) => {
        return { label: sector.title, value: sector?.id }
    })

    const handleChange = (value: string | string[], name: string) => {
        offers.setQuery({
            ...offers.filters,
            [name]: value,
        })
    }

    const handleChangeAutocomplete = (value: any, name: string) => {
        offers.setQuery({
            ...offers.filters,
            [name]: value.map((item: { label: String; value: string | number }) => item.value),
        })
    }

    return (
        <Box
            sx={{
                m: 'auto',
                display: { xs: 'grid', md: 'flex' },
                gap: '1.13rem',
                flexWrap: { xs: 'nowrap', md: 'wrap' },
                gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' },
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <TextField
                onChange={handleChange}
                label={_('Ingénieur') as string}
                startIcon={Search}
                name="keywords"
                value={offers.filters?.keywords}
            />
            <Autocomplete
                offers={offers}
                searchParams={searchParams}
                cities={cities}
                sectors={sectors}
                handleChange={handleChangeAutocomplete}
                options={autocompleteCities}
                name="zipCodes"
                label="Département ou ville"
                value={offers.filters?.zipCodes}
            />
            <Autocomplete
                offers={offers}
                searchParams={searchParams}
                cities={cities}
                sectors={sectors}
                handleChange={handleChangeAutocomplete}
                options={autocompleteSectors}
                name="sector"
                value={offers.filters?.sector}
                label="Secteur d’activité"
            />
        </Box>
    )
})
