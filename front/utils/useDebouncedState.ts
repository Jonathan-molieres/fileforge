'use client'

import { useState } from 'react'
import useDebounced from './useDebounced'

function useDebouncedState<T>(
    defaultValue?: T | undefined,
    delay: number = 350
): [T | undefined, T | undefined, (value: T | undefined) => void] {
    const [value, setValue] = useState<T | undefined>(defaultValue)
    return [value, useDebounced<T>(value, delay), setValue]
}

export default useDebouncedState
