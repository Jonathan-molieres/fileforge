'use client'

import encodeSearchParams from '@/utils/encodeSearchParams'
import { Pagination, PaginationItem, PaginationProps } from '@mui/material'
import Link from 'next/link'

interface PaginationSearchProps extends PaginationProps {
    uri: string
    count: number
    limit: number
    page: number
    params: { [key: string]: string | string[] | number | number[] | boolean | undefined | null }
}

export default function PaginationSearch({
    uri,
    params,
    count,
    limit,
    page,
    sx,
    ...props
}: PaginationSearchProps) {
    return (
        <Pagination
            count={Math.ceil(count / limit)}
            page={page}
            sx={{ mt: 2, ...sx }}
            renderItem={(item) => (
                <PaginationItem
                    component={Link}
                    href={`${uri}?${encodeSearchParams({ ...params, page: item.page }).toString()}`}
                    {...item}
                />
            )}
            {...props}
        />
    )
}
