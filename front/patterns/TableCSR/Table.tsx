'use client'

import Box from '@mui/material/Box'
import MuiTable, { TableProps as MuiTableProps } from '@mui/material/Table'

import TableContainer from '@mui/material/TableContainer'
import CustomFooter from './CustomFooter'
import TableHead from './TableHead'
import { useEffect, useMemo, useState } from 'react'
import TableRows from './TableBodyRow'
import TableState from './TableState'
import { observer } from 'mobx-react'
import TableBody from './TableBody'
import TablePagination from './TablePagination'

type TableStateProps<R> = MuiTableProps & Partial<TableState<R>>

export interface TableProps<R = any> extends TableStateProps<R> {}

export default observer(function Table<R>({ ...props }: TableProps<R>) {
    const table = useMemo(() => new TableState(props), [])

    useEffect(() => {
        table.setRows(props.rows)
    }, [props.rows])

    useEffect(() => {
        props.columns && table.setColumns(props.columns)
    }, [props.columns])

    useEffect(() => {
        table.setPage(props.page)
    }, [props.page])

    useEffect(() => {
        table.setTotal(props.total)
    }, [props.total])

    useEffect(() => {
        table.setCount(props.count)
    }, [props.count])

    return (
        <>
            <TableContainer
                sx={{
                    pt: `${table.maxShrink + 10}px`,
                    ...props.sx,
                }}
            >
                <MuiTable
                    sx={{
                        minWidth: { xs: '100%', md: 650 },
                        '& th, td': {
                            border: 0,
                            borderLeft: 1,
                            borderColor: '#CCC',
                            borderStyle: 'dashed',
                        },
                        '& th': {
                            backgroundColor: 'primary.main',
                            color: '#FFF',
                        },
                        background: '#FFF',
                    }}
                    aria-label="jobs candidates search"
                >
                    <TableHead table={table} />
                    <TableBody table={table} />

                    {table.rows && table.rows.length === 0 && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '80svh',
                            }}
                        >
                            {/* <Typography variant="h4">
                                Nous n&apos;avons pas trouvé de candidat.
                            </Typography> */}
                        </Box>
                    )}
                </MuiTable>
                <TablePagination table={table} />
            </TableContainer>
            {/* {table.pagination && <CustomFooter />} */}
        </>
    )
})
