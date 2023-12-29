import React from 'react'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { ListItemButton } from '@mui/material'

export default function IconeDrawer({
    handleCheckClick,
    handleClearClick,
}: {
    handleCheckClick: (e: React.MouseEvent<HTMLElement>) => void
    handleClearClick: (e: React.MouseEvent<HTMLElement>) => void
}) {
    return (
        <>
            <ListItemButton>
                <CheckIcon
                    style={{ cursor: 'pointer', color: 'green' }}
                    onClick={(e) => handleCheckClick(e)}
                />
            </ListItemButton>
            <ListItemButton>
                <ClearIcon
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={(e) => handleClearClick(e)}
                />
            </ListItemButton>
        </>
    )
}
