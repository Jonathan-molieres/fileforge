import cookies from '@/utils/cookies'
import { makeAutoObservable } from 'mobx'
import User from './account/User'

export class App {
    me = new User({})
    currentURL?: URL

    // admin = new Admin(this)
    cookies = cookies

    constructor() {
        makeAutoObservable(this)
    }

    async load() {}
}

const app = new App()
app.load().then()

export default app
