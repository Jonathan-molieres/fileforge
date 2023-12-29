'use client'

import AuthenticateModal from './AuthenticateModal'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import Loader from '@/patterns/Loader'
import app from '@/models/app'

interface RequireUserProps {
    authenticated?: boolean
    staff?: boolean
    admin?: boolean
    superuser?: boolean
    perms?: string[]
    mode?: 'passive' | 'modal' | 'tooltip' | 'redirect'

    children: any
}

export default observer(function RequireUser({
    authenticated = undefined,
    superuser,
    staff,
    admin,
    perms = [],
    mode = 'passive',
    children,
}: RequireUserProps) {
    useEffect(() => {
        if (!app.me.isSynced) {
            app.me.sync().then()
        }
    }, [app.me.isSynced])

    if (!app.me.isSynced) {
        return <Loader centered />
    }
    const requireAuthenticated = authenticated === true || superuser === true

    if (requireAuthenticated === true && app.me.isAnonymous) {
        // require authenticated user
        switch (mode) {
            case 'passive':
                return null
            case 'modal':
                return <AuthenticateModal open />
            case 'tooltip':
                return <div>Tooltip</div>
            case 'redirect':
                return <div>Redirect</div>
            default:
                return null
        }
    } else if (requireAuthenticated === false && !app.me.isAnonymous) {
        // require anonymous user
        switch (mode) {
            case 'passive':
                return null
            case 'modal':
            // return <LogoutModal open />
            case 'tooltip':
                return <div>Tooltip</div>
            case 'redirect':
                return <div>Redirect</div>
            default:
                return null
        }
    } else {
        let hasPermission = requireAuthenticated && !!app.me.isAuthenticated
        if (superuser === true) {
            hasPermission = hasPermission && !!app.me.isSuperuser
        }

        if (hasPermission) {
            return children
        } else {
            return <AuthenticateModal open={true} />
        }
    }
})
