'use client'

import Button from '@mui/material/Button'
import { observer } from 'mobx-react'
import React from 'react'
import AuthenticateModal from '../AuthenticateModal'
import RequireUser from '../RequireUser'
import app from '@/models/app'

interface AuthenticateButtonProps {
    className?: string
}

export default observer(function AuthenticateButton({ className }: AuthenticateButtonProps) {
    const [modalOpen, setModalOpen] = React.useState(false)

    const handleLogout = async () => {
        await app.me.logout()
    }
    const handleLogin = async () => {
        setModalOpen(true)
    }

    const handleClose = () => {
        setModalOpen(false)
    }

    return (
        <div>
            <RequireUser>
                {!app.me?.isAnonymous && <Button onClick={handleLogout}>Déconnexion</Button>}
            </RequireUser>
            <AuthenticateModal open={modalOpen} onClose={handleClose} />
        </div>
    )
})
