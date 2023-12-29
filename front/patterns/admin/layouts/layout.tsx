'use client'

import { ThemeProvider, createTheme, styled } from '@mui/material'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Sidebar from './Sidebar'
import { gradient } from '@/themes/constants'
import { useEffect, useState } from 'react'
import app from '@/models/app'
import { observer } from 'mobx-react'
import { primaryFont, secondaryFont } from '@/themes/typography'

export default observer(function AdminLayout({ children }: { children: React.ReactNode }) {
    const open = app.admin.sidebarOpen

    const handleDrawerOpen = () => {
        app.admin.setSidebarOpen(true)
    }

    const handleDrawerClose = () => {
        app.admin.setSidebarOpen(false)
    }

    useEffect(() => {
        app.admin.fetchApps().then()
    }, [])

    return (
        <Box
        // sx={{
        //     position: 'fixed',
        //     top: 0,
        //     left: 0,
        //     right: 0,
        //     bottom: 0,
        //     overflow: 'auto',
        //     // '& .MuiTypography-root, .MuiTableCell-root': {
        //     //     fontFamily: primaryFont.style,
        //     // },
        // }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateRows: 'auto 100%',
                    gridTemplateColumns: 'min-content 1fr',
                    minHeight: '100%',

                    gridTemplateAreas: `
                    "sidebar appbar"
                    "sidebar content"`,
                }}
            >
                <Box sx={{ gridArea: 'appbar', position: 'sticky', top: 0, zIndex: 10 }}>
                    <AppBar
                        position="relative"
                        color="secondary"
                        sx={(theme) => ({
                            zIndex: 10,
                            background: gradient.main,
                            // zIndex: theme.zIndex.drawer + 1,
                            transition: theme.transitions.create(['width', 'margin'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                            ...(open && {
                                transition: theme.transitions.create(['width', 'margin'], {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                            }),
                        })}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{
                                    ...(open && { display: 'none' }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            {app.admin.appbar ?? (
                                <Typography variant="h6" noWrap component="div">
                                    Work&You admin
                                </Typography>
                            )}
                            <Box sx={{ flexGrow: 1 }} />
                        </Toolbar>
                    </AppBar>
                </Box>
                <Box sx={{ gridArea: 'sidebar' }}>
                    <Box sx={{ gridArea: 'filters', top: 0, zIndex: 1001, position: 'sticky' }}>
                        <Sidebar open={open} onClose={handleDrawerClose} />
                    </Box>
                </Box>

                <Box sx={{ gridArea: 'content' }}>{children}</Box>
            </Box>
        </Box>
    )
})
