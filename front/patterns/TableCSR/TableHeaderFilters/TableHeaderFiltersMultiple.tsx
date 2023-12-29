'use client'
import app from '@/app/(private)/(cvtheque)/app'
import Candidate from '@/app/(private)/(cvtheque)/jobs/Candidate'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { SxProps } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { observer } from 'mobx-react'
import React from 'react'
import { TableColumn } from '../Table'

export interface TableProps {
    columns?: TableColumn[]
}

export type FilterType = 'startBy' | 'endBy' | 'contains' | 'notEmpty'

export default observer(function TableHeaderFiltersMultiple<R>({
    columnField,
    startText,
    setStartText,
    setFilterType,
    filterType,
}: {
    columnField: TableColumn
    startText: string
    setStartText: (value: string) => void
    setFilterType: (value: FilterType) => void
    filterType: FilterType
}) {
    //

    const handleSortStartWith = async (value: string) => {
        await setStartText(value)
        app.currentCandidateSearch.rowStartBy(
            filterType,
            columnField.field as keyof Candidate,
            value
        )
    }

    React.useEffect(() => {
        if (filterType === 'notEmpty') {
            app.currentCandidateSearch.rowStartBy(filterType, columnField.field as keyof Candidate)
        }
    }, [filterType])

    return (
        <MenuItem>
            <FilterAltIcon />
            &nbsp;&nbsp;&nbsp;
            <Select
                defaultValue={'startBy'}
                variant="filled"
                sx={{
                    width: '10rem',
                    '& .MuiSelect-select': {
                        p: '1rem',
                    },
                }}
                value={filterType}
                onChange={(e) => {
                    setFilterType(e.target.value as FilterType)
                }}
            >
                <MenuItem value="startBy">Commence par</MenuItem>
                <MenuItem value="endBy">Finit par</MenuItem>
                <MenuItem value="contains">Contient</MenuItem>
                <MenuItem value="notEmpty">N'est pas vide</MenuItem>
            </Select>
            {filterType !== 'notEmpty' && (
                <TextField
                    placeholder="Votre texte"
                    onChange={(e) => handleSortStartWith(e.target.value)}
                    onKeyDown={(e) => {
                        e.stopPropagation()
                    }}
                    autoComplete="off"
                    value={startText}
                />
            )}
        </MenuItem>
    )
})
