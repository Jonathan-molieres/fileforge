'use client'

import { _ } from '@/utils/i18n'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Dialog, DialogContent, DialogProps } from '@mui/material'
import Box from '@mui/material/Box'
import DialogTitle from '@mui/material/DialogTitle'
import { observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'

export interface ModalProps extends Omit<DialogProps, 'title'> {
    title?: React.ReactNode
    buttons?: React.ReactNode
    unclosable?: boolean
}

export default observer(function Modal({
    title,
    children,
    buttons,
    unclosable,
    ...props
}: ModalProps) {
    const dialogTopRef = useRef<HTMLDivElement>()
    const dialogBottomRef = useRef<HTMLDivElement>()

    const handleClose = () => {
        props.onClose?.({}, 'escapeKeyDown')
    }

    return (
        <Dialog id="dialog-modal" scroll={'body'} maxWidth="lg" {...props}>
            <Box ref={dialogTopRef}></Box>
            {!unclosable && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '1.8rem',
                        right: '1.8rem',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button
                        variant="text"
                        aria-label="close"
                        onClick={handleClose}
                        endIcon={<CloseIcon sx={{ color: 'primary.main' }} />}
                    >
                        {_('Fermer')}
                    </Button>
                </Box>
            )}
            {title && (
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        marginBottom: '10px',
                        fontSize: '3.6rem',
                        lineHeight: '4.4rem',
                    }}
                >
                    {title}
                </DialogTitle>
            )}
            <DialogContent>{children}</DialogContent>
            {buttons && (
                <Box
                    sx={{
                        display: 'grid',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: '1.2rem 1.8rem',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            p: '2.5rem',
                        }}
                    >
                        {buttons}
                    </Box>
                </Box>
            )}
            <Box ref={dialogBottomRef}></Box>
        </Dialog>
    )
})
