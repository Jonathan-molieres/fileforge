import React, { useState } from 'react'
import {
    List,
    Typography,
    ListItem,
    ListItemText,
    Divider,
    ListItemIcon,
    ListItemButton,
} from '@mui/material'
import { _ } from '@/utils/i18n'

import CandidateSearchMatrix from '@/models/jobs/CandidateSearchMatrix'
import MatrixDrawer from './MatrixDrawer'
import IconeDrawer from '../IconeDrawer'

export default function MatrixDrawerList({
    searchMatrices,
}: {
    searchMatrices: CandidateSearchMatrix[]
}) {
    const [selectedMatrix, setSelectedMatrix] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleLoadMatrice = (matrix: CandidateSearchMatrix) => {
        setSelectedMatrix(matrix)
        setIsDialogOpen(true)
    }

    const handleDeleteMatrice = (
        e: React.MouseEvent<HTMLElement>,
        matrix: CandidateSearchMatrix
    ) => {
        e.stopPropagation()
        matrix.delete()
    }
    const handleCurrentMatrice = (
        e: React.MouseEvent<HTMLElement>,
        matrix: CandidateSearchMatrix
    ) => {
        e.stopPropagation()
        matrix.setCurrent()
    }

    return (
        <>
            <Typography
                variant="h2"
                sx={{
                    textAlign: 'center',
                    marginTop: '16px',
                }}
            >
                {_('Matrices')}
            </Typography>
            <Divider />

            <List>
                {searchMatrices.map((matrix) => (
                    <ListItem key={matrix.id} onClick={() => handleLoadMatrice(matrix)}>
                        <ListItemButton>
                            <ListItemText primary={matrix.name} />
                        </ListItemButton>
                        <IconeDrawer
                            handleCheckClick={(e) => handleCurrentMatrice(e, matrix)}
                            handleClearClick={(e) => handleDeleteMatrice(e, matrix)}
                        />
                    </ListItem>
                ))}
            </List>
            {selectedMatrix && (
                <MatrixDrawer
                    matrix={selectedMatrix}
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                />
            )}
        </>
    )
}
