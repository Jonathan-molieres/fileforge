import React, { useState } from 'react'
import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    ListItemButton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box } from '@mui/material'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import { _ } from '@/utils/i18n'
import app from '@/models/app'
import SearchDrawerList from './search'
import MatrixDrawerList from './matrix'
import { observer } from 'mobx-react'

export default observer(function CustomDrawer() {
    const [matrixDrawerOpen, setMatrixDrawerOpen] = useState(false)
    const [searchDrawerOpen, setsearchDrawerOpen] = useState(false)

    const search = app.jobs.candidateSearch
    const user = app.me

    const [open, setOpen] = useState(false)

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const menuItems = [
        {
            icon: <SearchIcon sx={{ color: '#2E3484' }} />,
            title: 'Recherche',
            showText: open,
            handleClick: () => {
                setsearchDrawerOpen(!searchDrawerOpen)
                setMatrixDrawerOpen(false)
            },
            condition: user.isStaff,
        },

        {
            icon: <DashboardIcon sx={{ color: '#2E3484' }} />,
            title: 'Matrices',
            showText: open,
            handleClick: () => {
                setMatrixDrawerOpen(!matrixDrawerOpen)
                setsearchDrawerOpen(false)
            },
            condition: user.isAdmin,
        },
        {
            icon: <SupervisorAccountIcon sx={{ color: '#2E3484' }} />,
            title: 'Administration',
            showText: open,
            handleClick: () => {
                window.location.href = '/admin2/'
            },
            condition: user.isSuperuser,
        },
        {
            icon: <SupervisorAccountIcon sx={{ color: '#2E3484' }} />,
            title: 'Administration site',
            showText: open,
            handleClick: () => {
                window.location.href = '/admin/'
            },
            condition: user.isStaff,
        },
    ]
    return (
        <Box sx={{ display: 'flex', backgroundColor: '#f5f5f5' }}>
            <Drawer
                variant="permanent"
                open={open}
                sx={{ display: 'flex', flexDirection: 'column', width: open ? 240 : 90 }} //voir pour changer ca
            >
                <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
                    {open ? (
                        <ChevronLeftIcon sx={{ color: '#2E3484' }} />
                    ) : (
                        <ChevronRightIcon sx={{ color: '#2E3484' }} />
                    )}
                </IconButton>
                <List>
                    {menuItems.map(
                        (menuItem, index) =>
                            menuItem.condition && (
                                <ListItemButton key={index} onClick={menuItem.handleClick}>
                                    <ListItemIcon>{menuItem.icon}</ListItemIcon>
                                    {menuItem.showText && open && (
                                        <ListItemText primary={menuItem.title} />
                                    )}
                                </ListItemButton>
                            )
                    )}
                </List>
                <Divider />
            </Drawer>
            <Box>
                {matrixDrawerOpen && search.searchMatrices && (
                    <MatrixDrawerList searchMatrices={search.searchMatrices} />
                )}

                {searchDrawerOpen && <SearchDrawerList search={search} />}
            </Box>
        </Box>
    )
})
