'use client'

import MuiTableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { observer } from 'mobx-react'
import React from 'react'
import TableState from './TableState'
import TableHeadCell from './TableHeadCell'
import { gradient } from '../../themes/constants'

export interface TableHeadProps<R> {
    table: TableState<R>
}

export default observer(function TableHead<R>({ table }: TableHeadProps<R>) {
    return (
        <MuiTableHead>
            <TableRow
                sx={{
                    background: gradient.main,
                    // top: 0,
                    // zIndex: 99999,
                    // position: 'sticky',
                }}
            >
                <TableHeadCells table={table} />
            </TableRow>
        </MuiTableHead>
    )
})

export interface TableHeadCellsProps<R> {
    table: TableState<R>
}

export const TableHeadCells = observer(function TableHeadCells<R>({
    table,
}: TableHeadCellsProps<R>) {
    return table.columns.map((column, i) => (
        <TableHeadCell key={i} table={table} columnIndex={i} column={column} />
    ))
})
