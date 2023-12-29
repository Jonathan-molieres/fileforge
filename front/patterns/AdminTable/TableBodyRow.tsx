'use client'

import MuiTableRow from '@mui/material/TableRow'
import TableState from './Context'
import TableBodyRowCell from './TableBodyRowCell'
import { observer } from 'mobx-react'
import { lighten } from '@mui/material/styles'
import { TableCell } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

export interface TableBodyRowProps<R> {
    table: TableState<R>
    row: R
    rowIndex: number
    ref?: any
    provider?: any
}

export default observer(function TableBodyRow<R>({
    table,
    row,
    rowIndex,
    provider,
}: TableBodyRowProps<R>) {
    const handleRowClick = (e: any) => {
        const selection = window.getSelection()
        selection?.isCollapsed && table.clickRow(row)
    }
    const sx = table.getBodyRowSx?.({ row }) as {}

    return (
        <MuiTableRow
            ref={provider.innerRef}
            onClick={handleRowClick}
            {...provider.draggableProps}
            sx={(theme) => ({
                '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.action.hover,
                },
                '&:hover': {
                    backgroundColor: lighten(theme.palette.secondary.light, 0.7),
                },
                ...sx,
            })}
        >
            {table.onDragEnd && (
                <TableCell
                    component="th"
                    scope="row"
                    {...provider.dragHandleProps}
                    sx={{
                        p: 0,
                        width: '1%',
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                    }}
                >
                    <DragIndicatorIcon />
                </TableCell>
            )}
            <TableBodyRowCells table={table} row={row} rowIndex={rowIndex} />
        </MuiTableRow>
    )
})

export interface TableBodyRowCellsProps<R> {
    table: TableState<R>
    row: R
    rowIndex: number
}

export const TableBodyRowCells = observer(function TableBodyRowCells<R>({
    table,
    row,
    rowIndex,
}: TableBodyRowCellsProps<R>) {
    return table.columns.map((column, columnIndex) => (
        <TableBodyRowCell
            key={columnIndex}
            table={table}
            column={column}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            row={row}
        />
    ))
})
