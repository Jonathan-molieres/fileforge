'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function usePath(): [any, (path: string) => void, { [key: string]: string }] {
    // const pathname = usePathname()
    const router = useRouter()
    // const query = router.query

    // const initialPath = pathname

    const [path, setPath] = useState<string>()

    const changePath = (path: string | null | undefined) => {
        if (path) {
            // window.history.pushState({}, path, `/${path}`)
            router.push(path)
            setPath(path)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.onpopstate = () => {
                setPath(window.location.pathname.substr(1))
            }
            if (!path) {
                setPath(window.location.pathname.substr(1))
            }
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.onhashchange = null
            }
        }
    }, [])
    // @ts-ignore
    return [path, changePath]
}

export default usePath
