'use client'

import { observer } from 'mobx-react'

export default observer(function ({
    i18n,
    value,
    options,
}: {
    i18n: any
    value?: string
    options?: any
}): any {
    return i18n.getTranslation(value, options)
})
