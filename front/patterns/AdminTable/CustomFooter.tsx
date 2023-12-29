'use client'
import app from '@/app/(private)/(cvtheque)/app'
import { Box, Switch, Typography } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import { observer } from 'mobx-react'

export default observer(function CustomFooter() {
    const handleChange = async () => {
        app.currentCandidateSearch.toggleFilter('pagination')
    }

    return (
        <Box
            sx={{
                backgroundColor: '#f5f5f5',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                position: 'fixed',
                bottom: 0,
                right: 0,
                left: 0,
                zIndex: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 2,
                }}
            >
                <Typography sx={{ fontSize: '14px' }}>Pagination</Typography>
                <Switch
                    checked={app.currentCandidateSearch.paginate}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'Switch demo' }}
                />
                <Typography sx={{ display: { xs: 'none', md: 'block' }, fontSize: '14px' }}>
                    {app.currentCandidateSearch.count} résultat
                    {app.currentCandidateSearch.count > 1 && 's'}
                </Typography>
            </Box>
            {app.currentCandidateSearch.paginate && (
                <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    component="div"
                    count={app.currentCandidateSearch.count}
                    rowsPerPage={app.currentCandidateSearch.limit}
                    page={app.currentCandidateSearch.page}
                    labelRowsPerPage="Résultats par page"
                    onPageChange={(e, newPage) =>
                        app.currentCandidateSearch.setPagination({
                            page: newPage,
                            pageSize: app.currentCandidateSearch.limit,
                        })
                    }
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
                    }
                    onRowsPerPageChange={(e) =>
                        app.currentCandidateSearch.setPagination({
                            page: 0,
                            pageSize: Number(e.target.value),
                        })
                    }
                    sx={{
                        justifyContent: 'flex-end',
                        fontSize: '1rem',
                    }}
                />
            )}
        </Box>
    )
})
