'use client'

import MuiTableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import TableState from './TableState'
import { observer } from 'mobx-react'

export interface TableBodyRowCellProps<R> {
    table: TableState<R>
    columnIndex: number
    column: any
    row: R
}

export default observer(function TableBodyRowCell<R>({
    table,
    row,
    column,
    columnIndex,
}: TableBodyRowCellProps<R>) {
    const handleCellEnter = (e: any) => {
        table.setHoveredColumnIndex(columnIndex)
    }

    const handleCellLeave = () => {}
    const CellComponent =
        column.Cell ??
        (({ row }: { row: R }) =>
            // @ts-ignore
            column.field ? row[column.field] : '-')
    return (
        <MuiTableCell
            className={column.className}
            onMouseEnter={handleCellEnter}
            onMouseLeave={handleCellLeave}
            size="small"
            sx={(theme) => ({
                p: column.noGutter ? '4px 5px' : '4px 14px',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                verticalAlign: 'middle',
                fontSize: '0.875rem',
                textAlign: column.center ? 'center' : '',
                '&:hover': {
                    backgroundColor: theme.palette.secondary.light,
                    outline: `1px solid ${theme.palette.primary.light}`,
                    color: theme.palette.secondary.contrastText,
                },
                cursor: 'pointer',
            })}
        >
            <CellComponent row={row} />
        </MuiTableCell>
    )
})
