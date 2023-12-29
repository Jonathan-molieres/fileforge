'use client'
import app from '@/app/(private)/(cvtheque)/app'
import Candidate from '@/app/(private)/(cvtheque)/jobs/Candidate'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import NorthIcon from '@mui/icons-material/North'
import SouthIcon from '@mui/icons-material/South'
import { SxProps } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { observer } from 'mobx-react'
import React from 'react'
import { TableColumn } from '../Table'
import TableHeaderFiltersMultiple from './TableHeaderFiltersMultiple'

export interface TableProps {
    columns?: TableColumn[]
}

export type FilterType = 'startBy' | 'endBy' | 'contains' | 'notEmpty'

export default observer(function TableHeaderFiltersMenu<R>({
    anchorEl,
    setAnchorEl,
    columnField,
}: {
    anchorEl: HTMLElement | null
    setAnchorEl: (value: HTMLElement | null) => void
    columnField: TableColumn
}) {
    //
    const open = Boolean(anchorEl)
    const [startText, setStartText] = React.useState<string>('')
    const [filterType, setFilterType] = React.useState<FilterType>('startBy')

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleSortAsc = () => {
        app.currentCandidateSearch.rowSortBy(
            'ASC',
            columnField.field as keyof Candidate,
            columnField.ascendingMode
        )
    }

    const handleSortDesc = () => {
        app.currentCandidateSearch.rowSortBy(
            'DESC',
            columnField.field as keyof Candidate,
            columnField.ascendingMode
        )
    }

    const handleRestoreRows = async () => {
        await setStartText('')
        await setFilterType('startBy')
        app.currentCandidateSearch.restoreRows()
    }

    return (
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >
            {columnField.ascendingMode !== 'none' && (
                <>
                    <MenuItem onClick={handleSortAsc}>
                        <NorthIcon />
                        &nbsp;&nbsp;&nbsp;Filtrer par{' '}
                        {(columnField.ascendingMode === 'number' && 'ordre croissant') ||
                            (columnField.ascendingMode === 'date' && 'date la plus récente') ||
                            'ordre alphabétique (A-Z)'}
                    </MenuItem>
                    <MenuItem onClick={handleSortDesc}>
                        <SouthIcon />
                        &nbsp;&nbsp;&nbsp;Filtrer par{' '}
                        {(columnField.ascendingMode === 'number' && 'ordre décroissant') ||
                            (columnField.ascendingMode === 'date' && 'date la plus ancienne') ||
                            'ordre alphabétique (Z-A)'}
                    </MenuItem>
                </>
            )}
            <TableHeaderFiltersMultiple
                columnField={columnField}
                setStartText={setStartText}
                startText={startText}
                setFilterType={setFilterType}
                filterType={filterType}
            />
            <MenuItem onClick={handleRestoreRows}>
                <DeleteForeverIcon />
                &nbsp;&nbsp;&nbsp;retirer les filtres
            </MenuItem>
        </Menu>
    )
})
