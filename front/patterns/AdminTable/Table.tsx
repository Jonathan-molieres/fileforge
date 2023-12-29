'use client'

import Box from '@mui/material/Box'
import MuiTable, { TableProps as MuiTableProps } from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useMemo } from 'react'
import TableState from './Context'
import { observer } from 'mobx-react'
import TableBody from './TableBody'
import TablePagination from './TablePagination'
import { DragDropContext } from '@hello-pangea/dnd'
import TableHead from './TableHead'

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

    const handleDragEnd = (e) => {
        if (!e.destination) return
        let tempData = Array.from(table.rows)
        let [source_data] = tempData.splice(e.source.index, 1)
        tempData.splice(e.destination.index, 0, source_data)
        table.setRows(tempData)
        table.onDragEnd?.(e)
    }

    return (
        <>
            <TableContainer
                sx={{
                    pt: `${table.maxShrink + 10}px`,
                    ...props.sx,
                }}
            >
                <DragDropContext onDragEnd={handleDragEnd}>
                    <MuiTable
                        sx={{
                            minWidth: { xs: '100%', md: 650 },
                            '& th, td': {
                                border: 0,
                                borderLeft: 1,
                                borderColor: '#CCC',
                                borderStyle: 'dashed',
                                '&:first-child': {
                                    borderLeft: 0,
                                },
                            },
                            '& th': {
                                backgroundColor: '#ededed',
                                boxShadow: '0px 15px 25px -25px #333',
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
                                    // height: '80svh',
                                }}
                            >
                                {/* <Typography variant="h4">
                                Nous n&apos;avons pas trouvé de candidat.
                            </Typography> */}
                            </Box>
                        )}
                    </MuiTable>
                </DragDropContext>
                {table.page && <TablePagination table={table} />}
            </TableContainer>
            {/* {table.pagination && <CustomFooter />} */}
        </>
    )
})
