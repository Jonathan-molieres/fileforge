'use client'

import OfferSearch from '@/models/jobs/OfferSearch'
import { _ } from '@/utils/i18n'
import { observer } from 'mobx-react-lite'
import Select from '../Select'
import Briefcase from '../images/briefcase.svg'
import Box from '@mui/material/Box'

export default observer(function OffersHeaderNotCollapsedForm({ offers }: { offers: OfferSearch }) {
    //
    const handleChange = (value: string[], name: string) => {
        offers.setQuery({
            ...offers.filters,
            [name]: value,
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
            <Select
                label={_('Type de contrat')}
                startIcon={Briefcase}
                menuItems={[
                    { label: 'CDI', value: 'CDI' },
                    { label: 'CDD', value: 'CDD' },
                    { label: 'Indépendant', value: 'INDEPENDANT' },
                ]}
                value={offers.filters?.contractTypes}
                name="contractTypes"
                onChange={handleChange}
            />
            <Select
                label={_('Rémunération')}
                menuItems={[
                    { value: '< 20', label: 'Moins de 20K€' },
                    { value: '20-30', label: 'Entre 20€ et 30€' },
                    { value: '30-40', label: 'Entre 30K€ et 40K€' },
                    { value: '40-50', label: 'Entre 40K€ et 50K€' },
                    { value: '+50', label: 'Plus de 50K€' },
                ]}
                value={offers.filters?.salaryRanges}
                name="salaryRanges"
                onChange={handleChange}
            />
        </Box>
    )
})
