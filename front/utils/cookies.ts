import BaseCookies, { CookieGetOptions, CookieSetOptions } from 'universal-cookie'

class Cookies extends BaseCookies {
    get(name: string, defaultValue: any = undefined, options: CookieGetOptions = {}) {
        const value = super.get(name, options)
        if (value === undefined) {
            return defaultValue
        }
        return value
    }

    set(name: string, value: any, options: CookieSetOptions = { path: '/' }) {
        super.remove(name, { path: '/' })
        value == null ? super.remove(name, options) : super.set(name, value, options)
        return true
    }

    unset(name: string) {
        super.remove(name, { path: '/' })
        return true
    }
}
const cookies = new Cookies()

export type { Cookies }
export default cookies
