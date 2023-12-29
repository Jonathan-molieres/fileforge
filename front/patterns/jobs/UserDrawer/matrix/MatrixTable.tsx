// MatrixTable.tsx
import React from 'react'
import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
} from '@mui/material'
import { _ } from '@/utils/i18n'
import CandidateSearchVectorIndex from '@/models/jobs/CandidateSearchVectorIndex'
import CandidateSearchMatrix from '@/models/jobs/CandidateSearchMatrix'
import { observer } from 'mobx-react'
interface MatrixTableProps {
    columnOrder: string[]
    matrix: CandidateSearchMatrix
    handleDragStart: (e: DragEvent, criterionId: string) => void
    handleDragOver: (e: DragEvent) => void
    handleDrop: (e: DragEvent, targetCriterionId: string) => void
}

const MatrixTable: React.FC<MatrixTableProps> = ({
    columnOrder,
    matrix,
    handleDragStart,
    handleDragOver,
    handleDrop,
}: MatrixTableProps) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{_('Index')}</TableCell>
                        {columnOrder.map((criterionId) => {
                            const criterion = matrix.findCriterion(criterionId)
                            return (
                                <TableCell
                                    key={criterionId}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, criterionId)}
                                    onDragOver={(e) => handleDragOver(e)}
                                    onDrop={(e) => handleDrop(e, criterionId)}
                                    data-criterion-id={criterionId}
                                    contentEditable={true}
                                >
                                    {criterion ? criterion.name : ''}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow hover>
                        <TableCell>{_('Critère visible ?')}</TableCell>
                        {columnOrder.map((criterionId) => {
                            const criterion = matrix.findCriterion(criterionId)
                            return (
                                <TableCell key={criterionId}>
                                    <Checkbox
                                        checked={criterion?.isVisible}
                                        onChange={() => criterion?.setVisible(!criterion.isVisible)}
                                    />
                                </TableCell>
                            )
                        })}
                    </TableRow>
                    {Object.keys(CandidateSearchVectorIndex).map((VectorIndex) => {
                        return (
                            <TableRow key={VectorIndex} hover>
                                <TableCell>
                                    {CandidateSearchVectorIndex[VectorIndex].label}
                                </TableCell>
                                {columnOrder.map((criterionId) => {
                                    const criterion = matrix.findCriterion(criterionId)
                                    const vector = criterion?.vectors?.find(
                                        (vector) => vector.index === VectorIndex
                                    )
                                    return (
                                        <TableCell
                                            key={`${criterionId}-${VectorIndex}`}
                                            contentEditable={true}
                                            onBlur={(e) => {
                                                if (vector) {
                                                    const inputValue = e.currentTarget.innerText
                                                    const numericValue = parseFloat(inputValue)

                                                    if (!isNaN(numericValue)) {
                                                        // Si l'entrée est un nombre valide, mettez à jour le vecteur
                                                        vector.boost = numericValue
                                                    } else {
                                                        // Si l'entrée n'est pas un nombre valide, affichez un message d'erreur ou une valeur par défaut
                                                        e.currentTarget.innerText = 'Erreur'
                                                        // Vous pouvez également réinitialiser la valeur du vecteur ici si nécessaire
                                                        // vector.boost = NaN;
                                                    }
                                                }
                                            }}
                                        >
                                            {vector ? vector.boost : 'NaN'}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
export default observer(MatrixTable)
