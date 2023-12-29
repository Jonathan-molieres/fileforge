import { makeAutoObservable } from 'mobx'
import api from '@/utils/api'
import { _ } from '@/utils/i18n'
import Agency, { AgencyData } from '@/models/legacy/agence/Agency'
import MenuItem from '../_Navbar/MenuItem'

class Context {
    //

    agencies: Agency[] = []
    menu = new MenuItem({
        label: _('Nos agences'),
        href: '/nos-agences/',
        items: this.agencies.map((agency) => ({
            href: agency.href,
            label: agency.title,
        })),
    })

    constructor() {
        makeAutoObservable(this)
    }

    async fetchAgencies(params?: { [key: string]: string | undefined }) {
        if (!this.agencies.length) {
            const data = await api.get<AgencyData[]>(`/legacy/agence/list`)
            this.agencies = data.map((data) => new Agency(data))
            this.menu = new MenuItem({
                label: _('Nos agences'),
                href: '/nos-agences/',
                items: this.agencies.map((agency) => ({
                    href: agency.href,
                    label: agency.title,
                })),
            })
        }
    }
}
const context = new Context()
export default context
