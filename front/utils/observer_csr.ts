'use client'

import { Observer, observer } from 'mobx-react'

export default observer(({ children }: { children: any }) => {
    console.log('reload')
    return children
})
//Observer
