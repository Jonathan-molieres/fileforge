import { AppBar, Box, Pagination, Paper, Stack, Toolbar, Typography } from '@mui/material'
import TableState from './Context'
import { observer } from 'mobx-react'
import { _ } from '@/utils/i18n'

export interface TablePaginationProps<R> {
    table: TableState<R>
}

export default observer(function TablePagination<R>({ table }: TablePaginationProps<R>) {
    const { count, resultLabel, total, limit } = table

    const pageCount = Math.ceil((count ?? 1) / (limit || 1))

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        table.setPage(value)
    }

    return (
        <Paper
            sx={{
                display: 'grid',
                position: 'fixed',
                bottom: 0,
                // top: 'auto',
                left: 0,
                right: 0,
                p: 1,
                alignContent: 'center',
                justifyItems: 'center',
            }}
        >
            <Pagination
                count={pageCount}
                showFirstButton
                showLastButton
                onChange={handleChange}
                boundaryCount={2}
            />
            <Box sx={{ display: 'flex', gap: 0.4, pl: 1 }}>
                <Typography color="secondary.main"> {count}</Typography> /
                <Typography>{total}</Typography>
                <Typography
                    sx={{
                        fontSize: 12,
                    }}
                >
                    {resultLabel ?? _('Résultats')}
                </Typography>
            </Box>
        </Paper>
    )
})
