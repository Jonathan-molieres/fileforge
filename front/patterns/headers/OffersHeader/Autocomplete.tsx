'use client'

import OfferSearch from '@/models/jobs/OfferSearch'
import { _ } from '@/utils/i18n'
import { observer } from 'mobx-react-lite'
import TextField from './TextField'
import Target from './images/target.svg'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import City from '@/models/City'
import SectorSearch from '@/models/SectorSearch'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import Checkbox from '@mui/material/Checkbox'
import { Chip, Typography } from '@mui/material'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

export default observer(function CustomAutocomplete({
    offers,
    searchParams,
    cities,
    sectors,
    handleChange,
    options,
    name,
    value,
    label,
}: {
    offers: OfferSearch
    searchParams: any
    cities: City[]
    sectors: SectorSearch
    handleChange: (value: any, name: string) => void
    options: any
    value: any
    name: string
    label: string
}) {
    const handleChangeAutocomplete = (value: any, name: string) => {
        handleChange(value, name)
    }

    const renderValue = Object.values(value).map((item: any) => {
        const index = options.findIndex(
            (option: any) => option.value === item || option.value === parseInt(item)
        )
        return options[index]
    })

    return (
        <Autocomplete
            disableCloseOnSelect
            options={options}
            sx={{
                padding: 0,
                '& .MuiInputBase-root': {
                    minWidth: '16.25rem',
                    padding: 0,
                },
                '& .MuiAutocomplete-input': {
                    padding: '0.54rem 0.62rem 0.54rem 0.88rem !important',
                },
            }}
            multiple
            renderOption={(props, option: { label: string }, { selected }) => {
                return (
                    <li {...props}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.label}
                    </li>
                )
            }}
            value={renderValue.map((item: any) => {
                return item
            })}
            renderTags={(value: any, getTagProps) => {
                return (
                    (value.length > 0 && (
                        <>
                            <Chip
                                component="span"
                                variant="filled"
                                label={value[0]?.label || value[0]}
                                {...getTagProps({ index: 0 })}
                            />
                            {value.length > 1 && (
                                <Chip
                                    component="span"
                                    variant="filled"
                                    label={`+${value.length - 1}`}
                                />
                            )}
                        </>
                    )) ||
                    null
                )
            }}
            onChange={(event, value) => handleChangeAutocomplete(value, name)}
            renderInput={(params) => (
                <TextField {...params} label={_(label) as string} startIcon={Target} name={name} />
            )}
        />
    )
})
