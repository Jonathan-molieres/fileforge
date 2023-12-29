'use client'

import { useEffect, useState } from 'react'

const useDebounced = <T>(value: T | undefined, delay = 350): T | undefined => {
    const [debouncedValue, setDebouncedValue] = useState<T | undefined>(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouncedValue
}

export default useDebounced
