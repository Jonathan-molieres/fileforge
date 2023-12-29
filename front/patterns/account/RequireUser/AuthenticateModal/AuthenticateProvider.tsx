'use client'

import usePath from '@/utils/usePath'
import LoadingButton from '@mui/lab/LoadingButton'
import React, { useEffect } from 'react'
import { providers } from './AuthenticateProviders'
import { Button, IconButton } from '@mui/material'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import app from '@/models/app'
import { _ } from '@/utils/i18n'

export interface ProviderProps {
    provider: string
    children?: React.ReactNode
}

export default function Provider({ provider, children }: ProviderProps) {
    //

    const callbackData: any = Object.fromEntries(useSearchParams().entries())
    const [loaded, setLoaded] = React.useState(false)
    const [path, changePath] = usePath()
    const { label = '', Icon = null }: { label: string; Icon?: any } = providers[provider] ?? {}
    const getCallback = () => `${document.location.origin}/account/authenticate/${provider}/`

    const handleClick = () => {
        localStorage.setItem('account.authenticate.position', path)
        app.me
            .login({ provider, callback: getCallback(), callbackData, position: path })
            .then((redirectUrl: any) => {
                changePath(redirectUrl)
            })
    }

    useEffect(() => {
        if (!loaded && callbackData && Object.keys(callbackData).length) {
            setLoaded(true)
            app.me
                .login({
                    provider,
                    callback: getCallback(),
                    callbackData,
                    position: localStorage.getItem('account.authenticate.position'),
                })
                .then((redirectUrl: any) => {
                    changePath(redirectUrl)
                    app.me.sync().then()
                })
        }
    }, [callbackData])

    return (
        <LoadingButton
            size="large"
            color="secondary"
            loadingPosition="start"
            loading={callbackData.code}
            onClick={handleClick}
            variant="contained"
            startIcon={<LockOpenIcon />}
        >
            {_('Se connecter')}
        </LoadingButton>
    )
}
