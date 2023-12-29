'use client'

import MuiTableRow from '@mui/material/TableRow'
import TableState from './TableState'
import TableBodyRowCell from './TableBodyRowCell'
import { observer } from 'mobx-react'
import { SxProps, Theme, lighten } from '@mui/material/styles'

export interface TableBodyRowProps<R> {
    table: TableState<R>
    row: R
}

export default observer(function TableBodyRow<R>({ table, row }: TableBodyRowProps<R>) {
    const handleRowClick = (e: any) => {
        const selection = window.getSelection()
        selection?.isCollapsed && table.clickRow(row)
    }
    const sx = table.getBodyRowSx?.({ row }) as {}

    return (
        <MuiTableRow
            sx={(theme) => ({
                '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.action.hover,
                },
                '&:hover': {
                    backgroundColor: lighten(theme.palette.secondary.light, 0.7),
                },
                ...sx,
            })}
            onClick={handleRowClick}
        >
            <TableBodyRowCells table={table} row={row} />
        </MuiTableRow>
    )
})

export interface TableBodyRowCellsProps<R> {
    table: TableState<R>
    row: R
}

export const TableBodyRowCells = observer(function TableBodyRowCells<R>({
    table,
    row,
}: TableBodyRowCellsProps<R>) {
    return table.columns.map((column, i) => (
        <TableBodyRowCell key={i} table={table} column={column} columnIndex={i} row={row} />
    ))
})
