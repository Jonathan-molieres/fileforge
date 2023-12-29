import React, { useEffect, useState } from 'react'
import {
    Typography,
    Dialog,
    DialogContent,
    Box,
    Checkbox,
    TextField,
    Button,
    Divider,
} from '@mui/material'
import { _ } from '@/utils/i18n'
import CandidateSearchMatrix from '@/models/jobs/CandidateSearchMatrix'
import { observer } from 'mobx-react'
import MatrixTable from './MatrixTable'

export default observer(function MatriceDrawer({
    matrix,
    open,
    onClose,
}: {
    matrix: CandidateSearchMatrix
    open: boolean
    onClose: () => void
}) {
    const [columnOrder, setColumnOrder] = useState(() => {
        if (matrix.criteria) {
            return matrix.criteria
                .slice()
                .sort((a, b) => (a.position && b.position ? a.position - b.position : 0))
                .map((criterion) => criterion.id)
        } else {
            return []
        }
    })

    useEffect(() => {
        matrix.fetch()
    }, [])

    const handleDragStart = (e: DragEvent, criterionId: string) => {
        e.dataTransfer?.setData('criterionId', criterionId)
    }

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        // ca reset une colonne a chaque fois des que je met over effect
        // const draggedColumnId = e.dataTransfer.getData('criterionId')
        // if (draggedColumnId !== e.currentTarget.getAttribute('data-criterion-id')) {
        //     const newColumnOrder = [...columnOrder]
        //     const targetIndex = newColumnOrder.indexOf(
        //         e.currentTarget.getAttribute('data-criterion-id')
        //     )
        //     newColumnOrder.splice(newColumnOrder.indexOf(draggedColumnId), 1)
        //     newColumnOrder.splice(targetIndex, 0, draggedColumnId)
        //     setColumnOrder(newColumnOrder)
        // }
    }

    const handleDrop = (e: DragEvent, targetCriterionId: string) => {
        e.preventDefault()

        const draggedCriterionId = e.dataTransfer?.getData('criterionId') as string
        const newColumnOrder = [...columnOrder]
        const draggedIndex = newColumnOrder.indexOf(draggedCriterionId)
        const targetIndex = newColumnOrder.indexOf(targetCriterionId)

        if (draggedIndex !== -1 && targetIndex !== -1) {
            newColumnOrder.splice(draggedIndex, 1)
            newColumnOrder.splice(targetIndex, 0, draggedCriterionId)
            setColumnOrder(newColumnOrder)
        }
    }

    const handleSaveMatrix = () => {
        matrix.update()
    }
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="lg">
                <Typography
                    variant="h1"
                    sx={{
                        textAlign: 'center',
                        marginTop: '16px',
                    }}
                >
                    {_('Éditeur de matrices')}
                </Typography>
                <Button variant="outlined" onClick={handleSaveMatrix}>
                    {_('Sauvegarder la matrice')}
                </Button>
                <Divider />
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr',
                                    alignItems: 'center',
                                    gap: '1rem',
                                }}
                            >
                                {_('Nom de la matrice')}
                                <TextField
                                    required
                                    id="standard-required"
                                    label="Required"
                                    defaultValue="Hello World"
                                    value={matrix.name}
                                    onChange={(e) => (matrix.name = e.target.value)}
                                />
                            </Typography>
                            <Typography
                                variant="h5"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr 1fr',
                                    alignItems: 'center',
                                }}
                            >
                                {_('Matrices par défaut')}
                                <Checkbox
                                    checked={matrix.isDefault}
                                    onChange={() => matrix.setDefault(!matrix.isDefault)}
                                />
                                <Typography variant="body1">
                                    {matrix.isDefault ? 'Oui' : 'Non'}
                                </Typography>
                            </Typography>
                        </Box>
                    </Box>
                    <MatrixTable
                        columnOrder={columnOrder}
                        matrix={matrix}
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
})
