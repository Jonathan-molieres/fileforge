'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { Box, Drawer, List, ListItemText, ListItemButton } from '@mui/material'

interface MenuItem {
    label: string
    key: string
}

interface PageProps {}

const menuItems: MenuItem[] = [
    { label: 'Impôt', key: 'tax' },
    { label: 'Bulletin', key: 'bulletin' },
    // Ajoutez d'autres éléments de menu selon vos besoins
]

const Page: React.FC<PageProps> = () => {
    const [open, setOpen] = useState(false)

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    return (
        <>
            {/* Main Content */}
            <Box>
                <Box onClick={handleDrawerOpen}>Dashboard</Box>
                {/* <Box>Main Content Goes Here</Box> */}
            </Box>

            {/* Drawer (Side Menu) */}
            <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
                <List>
                    {menuItems.map((item) => (
                        <Link
                            key={item.key}
                            href="/dashboard/file"
                            as={`/dashboard/file?typefile=${item.key}`}
                            passHref
                        >
                            <ListItemButton component="a">
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </Link>
                    ))}
                </List>
            </Drawer>
        </>
    )
}

export default Page
