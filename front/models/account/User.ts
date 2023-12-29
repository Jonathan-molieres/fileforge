// ██╗   ██╗███████╗███████╗██████╗
// ██║   ██║██╔════╝██╔════╝██╔══██╗
// ██║   ██║███████╗█████╗  ██████╔╝
// ██║   ██║╚════██║██╔══╝  ██╔══██╗
// ╚██████╔╝███████║███████╗██║  ██║
//  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝

import api from '@/utils/api'
import cookies from '@/utils/cookies'
import instantiate from '@/utils/instantiate'
import { makeAutoObservable } from 'mobx'

//  █████╗ ██████╗ ██╗    ██████╗  █████╗ ████████╗ █████╗
// ██╔══██╗██╔══██╗██║    ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
// ███████║██████╔╝██║    ██║  ██║███████║   ██║   ███████║
// ██╔══██║██╔═══╝ ██║    ██║  ██║██╔══██║   ██║   ██╔══██║
// ██║  ██║██║     ██║    ██████╔╝██║  ██║   ██║   ██║  ██║
// ╚═╝  ╚═╝╚═╝     ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
export interface UserData extends Omit<User, 'permissions'> {}

// ██╗███╗   ██╗███████╗████████╗ █████╗ ███╗   ██╗ ██████╗███████╗
// ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗████╗  ██║██╔════╝██╔════╝
// ██║██╔██╗ ██║███████╗   ██║   ███████║██╔██╗ ██║██║     █████╗
// ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║╚██╗██║██║     ██╔══╝
// ██║██║ ╚████║███████║   ██║   ██║  ██║██║ ╚████║╚██████╗███████╗
// ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝
export default class User {
    //

    id?: string = undefined
    firstName?: string = undefined
    sessionToken?: string = undefined
    isAnonymous?: boolean = undefined
    isAdmin? = false
    isSuperuser? = false
    isStaff? = false
    //
    isFetching = false
    isSynced = false

    get isAuthenticated() {
        return !this.isAnonymous
    }

    constructor(data: Parameters<typeof User.prototype.load>[0]) {
        this.load(data)
        makeAutoObservable(this)
    }

    load(data: Partial<Pick<User | UserData, keyof User>> = {}) {
        instantiate(this, data, {})
        this.setFetching(false)
    }

    async sync() {
        this.load(await api.get<UserData>('/account/me'))
        this.setIsSynced(true)
    }

    async getProfile() {
        //    await api.get<ProfileData>('/account/users/me/profile').then((profile: ProfileData) =>
        //         this.load({ profile })
        //     )
    }

    async login({
        provider = 'surviving-data',
        callback,
        callbackData,
        position,
    }: {
        provider: String
        callback: string
        callbackData?: {}
        position?: string | null
    }) {
        return await api.post<any>('/account/login/me', {
            params: { provider, callback, position },
            data: callbackData,
        })
    }

    async logout() {
        cookies.unset('token')
    }

    setFetching(value: boolean) {
        this.isFetching = value
    }

    setIsSynced(value: boolean) {
        this.isSynced = value
    }
}
