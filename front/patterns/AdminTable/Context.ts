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
    headSx?: SxProps<Theme>
    Cell?: React.FC<{ row: T; rowIndex: number; columnIndex: number }>
    shrink?: boolean
    noGutter?: boolean
    center?: boolean

    // sortable?: boolean | string
    sort?: 'asc' | 'desc'
}

export default class Context<R> {
    columns: TableColumn<R>[] = []
    rows: R[] = []
    onRowClick?: (row: R) => void = undefined
    onHeadCellClick?: (column: TableColumn<R>) => void = undefined
    hoveredColumnIndex?: number = undefined
    getBodyRowSx?: ({ row }: { row: R }) => SxProps<Theme> = undefined
    onPageChange?: (page?: number) => void = undefined
    page?: number = undefined
    count?: number = undefined
    total?: number = undefined
    limit?: number = undefined
    pagination?: boolean = undefined
    showFilters?: boolean = undefined
    shrinks: { [index: number]: number } = {}
    sort: TableSort<R> = {}
    resultLabel?: React.ReactNode = undefined
    headerSticky?: number = undefined
    onDragEnd?: (result: any) => void = undefined

    constructor(data: Partial<Context<R>>) {
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
