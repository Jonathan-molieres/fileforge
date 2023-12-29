'use client'

import MuiTableBody from '@mui/material/TableBody'
import { observer } from 'mobx-react'
import React from 'react'
import TableState from './TableState'
import TableBodyRow from './TableBodyRow'

export interface TableBodyProps<R> {
    table: TableState<R>
}

export default observer(function TableBody<R>({ table }: TableBodyProps<R>) {
    return (
        <MuiTableBody>
            <TableBodyRows table={table} />
        </MuiTableBody>
    )
})

export interface TableBodyRowsProps<R> {
    table: TableState<R>
}

export const TableBodyRows = observer(function TableBodyRows<R>({ table }: TableBodyRowsProps<R>) {
    return table.rows?.map((row, i) => <TableBodyRow<R> key={i} table={table} row={row} />)
})
