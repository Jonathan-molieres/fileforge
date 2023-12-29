'use client'

import MuiTableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import Context from './Context'
import { observer } from 'mobx-react'

export interface TableBodyRowCellProps<R> {
    table: Context<R>
    row: R
    rowIndex: number
    columnIndex: number
    column: any
}

export default observer(function TableBodyRowCell<R>({
    table,
    row,
    rowIndex,
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
                ...column.sx,
            })}
        >
            <CellComponent row={row} columnIndex={columnIndex} rowIndex={rowIndex} />
        </MuiTableCell>
    )
})
