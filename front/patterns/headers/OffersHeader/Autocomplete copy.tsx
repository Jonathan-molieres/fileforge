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
    label,
}: {
    offers: OfferSearch
    searchParams: any
    cities: City[]
    sectors: SectorSearch
    handleChange: (value: any, name: string) => void
    options: any
    name: string
    label: string
}) {
    const handleChangeAutocomplete = (value: any, name: string) => {
        handleChange(value, name)
    }

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
            renderTags={(value, getTagProps) => {
                return (
                    (value.length > 0 && (
                        <>
                            <Box
                                component="span"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    p: '0.25rem',
                                    borderRadius: '0.25rem',
                                    backgroundColor: (theme) => theme.palette.primary.main,
                                    color: (theme) => theme.palette.primary.contrastText,
                                    fontSize: '0.75rem',
                                    lineHeight: '1rem',
                                }}
                                {...getTagProps({ index: 0 })}
                            >
                                {value[0].label}
                            </Box>
                            {value.length > 1 && (
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        p: '0.25rem',
                                        borderRadius: '0.25rem',
                                        backgroundColor: (theme) => theme.palette.primary.main,
                                        color: (theme) => theme.palette.primary.contrastText,
                                        fontSize: '0.75rem',
                                        lineHeight: '1rem',
                                    }}
                                >
                                    {`+${value.length - 1}`}
                                </Box>
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
