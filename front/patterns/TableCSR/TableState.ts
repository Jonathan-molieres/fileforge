'use client'

import { SxProps, Theme } from '@mui/material'
import { makeAutoObservable } from 'mobx'
import React from 'react'

export interface TableSort<T = any> {
    [field: string]: {
        order: 'asc' | 'desc'
    }
}
//{ price: { order: 'desc' } }
export interface TableColumn<T = any> {
    className?: string
    label?: React.ReactNode
    field?: string
    sx?: SxProps<Theme>
    Cell?: React.FC<{ row: T }>
    shrink?: boolean
    noGutter?: boolean
    center?: boolean
    // sortable?: boolean | string
    sort?: 'asc' | 'desc'
}

export default class TableState<R> {
    columns: TableColumn<R>[] = []
    rows?: R[] = []
    onRowClick?: (row: R) => void
    onHeadCellClick?: (column: TableColumn<R>) => void
    hoveredColumnIndex?: number = undefined
    getBodyRowSx?: ({ row }: { row: R }) => SxProps<Theme>
    onPageChange?: (page?: number) => void
    page?: number = undefined
    count?: number = undefined
    total?: number = undefined
    limit?: number = undefined
    pagination?: boolean = undefined
    showFilters?: boolean = undefined
    shrinks: { [index: number]: number } = {}
    sort: TableSort<R> = {}
    resultLabel?: React.ReactNode = undefined

    constructor(data: Partial<TableState<R>>) {
        Object.assign(this, data)
        makeAutoObservable(this)
    }

    setShrink(columnIndex: number, width?: number) {
        this.shrinks = { ...this.shrinks, [columnIndex]: width ?? 0 }
    }

    get maxShrink(): number {
        return Math.max(...Object.values(this.shrinks)) ?? 0
    }

    setColumns(columns: TableColumn<R>[]) {
        this.columns = columns
    }

    setPage(page?: number) {
        this.page = page
        this.onPageChange?.(page)
    }

    setCount(count?: number) {
        this.count = count
    }

    setTotal(total?: number) {
        this.total = total
    }

    setLimit(limit?: number) {
        this.limit = limit
    }

    setRows(rows?: R[]) {
        this.rows = rows ?? []
    }

    setHoveredColumnIndex(index?: number) {
        this.hoveredColumnIndex = index
    }

    clickRow(row: R) {
        this.onRowClick?.(row)
    }

    headCellClick(column: TableColumn<R>) {
        this.onHeadCellClick?.(column)
    }
}
