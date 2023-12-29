'use client'

import MuiTableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { observer } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'
import TableState from './Context'
import TableHeadCell from './TableHeadCell'
import { gradient } from '@/themes/constants'
import { TableCell } from '@mui/material'

export interface TableHeadProps<R> {
    table: TableState<R>
}

export default observer(function TableHead<R>({ table }: TableHeadProps<R>) {
    const [top, setTop] = useState(0)
    const ref = useRef<any>(null)

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const top = window.scrollY
                ref.current.style.top = `${top}px`
            }
        }
        if (table.headerSticky) {
            window.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (table.headerSticky) {
                window.removeEventListener('scroll', handleScroll)
            }
        }
    }, [table.headerSticky])

    return (
        <MuiTableHead
            sx={{
                background: gradient.main,
                backgroundColor: '#ededed',
                // boxShadow: '0px 15px 25px -25px #333',
            }}
        >
            <TableRow
                ref={ref}
                sx={{
                    zIndex: 1,
                    position: 'relative',
                    backgroundColor: '#ededed',
                    boxShadow: '0px 15px 25px -25px #333',
                }}
            >
                {table.onDragEnd && (
                    <TableCell
                        component="th"
                        scope="row"
                        sx={{
                            p: 0,
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                        }}
                    ></TableCell>
                )}
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
