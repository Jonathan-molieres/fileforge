'use client'
import MoreVert from '@mui/icons-material/MoreVert'
import { SxProps } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { observer } from 'mobx-react'
import React from 'react'
import { TableColumn } from '../Table'
import TableHeaderFiltersMenu from './TableHeaderFiltersMenu'

export interface TableProps {
    columns?: TableColumn[]
}

export type FilterType = 'startBy' | 'endBy' | 'contains' | 'notEmpty'

export default observer(function TableHeaderFilters<R>({ column }: { column: TableColumn }) {
    //
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const [columnField, setColumn] = React.useState<TableColumn>({} as TableColumn)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: TableColumn) => {
        setAnchorEl(event.currentTarget)
        setColumn(row)
    }

    return (
        <>
            <Box>
                <IconButton
                    size="small"
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={(e) => handleClick(e, column)}
                >
                    <MoreVert />
                </IconButton>
            </Box>
            <TableHeaderFiltersMenu
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                columnField={columnField}
            />
        </>
    )
})
