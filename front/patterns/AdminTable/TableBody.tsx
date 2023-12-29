'use client'

import MuiTableBody from '@mui/material/TableBody'
import { observer } from 'mobx-react'
import React from 'react'
import TableState from './Context'
import TableBodyRow from './TableBodyRow'
import { Draggable, Droppable } from '@hello-pangea/dnd'

export interface TableBodyProps<R> {
    table: TableState<R>
}

export default observer(function TableBody<R>({ table }: TableBodyProps<R>) {
    return (
        <Droppable droppableId="droppable-1">
            {(provider) => (
                <MuiTableBody ref={provider.innerRef} {...provider.droppableProps}>
                    <TableBodyRows table={table} />
                </MuiTableBody>
            )}
        </Droppable>
    )
})

export interface TableBodyRowsProps<R> {
    table: TableState<R>
}

export const TableBodyRows = observer(function TableBodyRows<R>({ table }: TableBodyRowsProps<R>) {
    return table.rows?.map((row, rowIndex) => (
        <Draggable key={rowIndex} draggableId={rowIndex.toString()} index={rowIndex}>
            {(provider) => (
                <TableBodyRow<R> rowIndex={rowIndex} table={table} row={row} provider={provider} />
            )}
        </Draggable>
    ))
})
