'use client'

import { Box, Dialog, DialogProps, DialogTitle, Typography } from '@mui/material'
import { observer } from 'mobx-react'
import React from 'react'
import AuthenticateProvider from './AuthenticateProvider'
import { _ } from '@/utils/i18n'
import Baseline from '@/patterns/Baseline/Baseline'

interface AuthenticateModalProps extends DialogProps {}

export default observer(function AuthenticateModal({
    open,
    onClose,
    ...props
}: AuthenticateModalProps) {
    return (
        <Dialog
            onClose={onClose}
            open={open}
            fullWidth={true}
            maxWidth="xs"
            sx={{
                '& .MuiDialog-container > div': {
                    borderRadius: '10px',
                    minHeight: { xs: '30vh', sm: '30vh' },
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr',
                },
            }}
            {...props}
        >
            <DialogTitle
                sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <Baseline />
            </DialogTitle>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    py: 2,
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h2">
                    {_("Bienvenue sur <br />l'espace Staff de Work&You", { html: true })}
                </Typography>
                <AuthenticateProvider provider={'google'}>Se connecter</AuthenticateProvider>
            </Box>
        </Dialog>
    )
})
