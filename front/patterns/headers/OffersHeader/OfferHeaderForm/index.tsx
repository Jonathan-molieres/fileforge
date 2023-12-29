'use client'

import OfferSearch from '@/models/jobs/OfferSearch'
import Section from '@/app/(public)/_Section/Section'
import { _ } from '@/utils/i18n'
import { observer } from 'mobx-react-lite'
import OffersHeaderFormAction from './OffersHeaderFormAction'
import City from '@/models/City'
import SectorSearch from '@/models/SectorSearch'
import OffersHeaderCollapsedForm from './OffersHeaderCollapsedForm'
import OffersHeaderNotCollapsedForm from './OffersHeaderNotCollapsedForm'

export default observer(function OffersHeaderForm({
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
    const isNotCollapse = () => {
        if (offers.filters?.contractTypes && offers.filters?.salaryRanges)
            return (
                offers.collapsed === false ||
                offers.filters?.contractTypes?.length > 0 ||
                offers.filters?.salaryRanges?.length > 0
            )
        else return false
    }

    return (
        <Section
            flat
            component={'div'}
            color={'transparent'}
            wrapperSx={{
                py: 0,
            }}
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
            <OffersHeaderCollapsedForm
                offers={offers}
                searchParams={searchParams}
                cities={cities}
                sectors={sectors}
            />
            {isNotCollapse() && <OffersHeaderNotCollapsedForm offers={offers} />}
            <OffersHeaderFormAction offers={offers} isCollapse={isNotCollapse()} />
        </Section>
    )
})
