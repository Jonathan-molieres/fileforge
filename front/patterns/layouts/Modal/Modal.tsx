import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogProps, Box } from '@mui/material'
import { _ } from '@/utils/i18n'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

interface ModalProps extends DialogProps {
    dialogTitle?: React.ReactNode
    actions?: React.ReactNode
    onClose?: () => void
}
export default function Modal({
    children,
    onClose,
    open,
    dialogTitle,
    actions,
    ...props
}: ModalProps) {
    return (
        <>
            <Dialog
                PaperProps={{
                    sx: {
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        textAlign: 'center',
                        borderRadius: '40px',
                        p: 4,
                    },
                }}
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
                {...props}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 25,
                        right: 25,
                        cursor: 'pointer',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                            backgroundColor: 'rgb(32, 36, 92)',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogTitle variant="h2">{dialogTitle}</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: 2,
                        padding: 5,
                    }}
                >
                    {children}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>{actions}</DialogActions>
            </Dialog>
        </>
    )
}
