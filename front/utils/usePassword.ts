import styles from '@/generic/SafePassword/SafePassword.module.scss'
import { useState } from 'react'

export default function usePasswords() {
    const [password, setPassword] = useState('')
    let lastLineActive: any
    let lineToActivate: any
    const searchLineActive = () => {
        // Select element with class equal to "line", but not "line_container"
        const selector = 'div[class*=line]:not([class*=line_container])'
        const elems = Array.from(document.querySelectorAll(selector))

        // Find the last line with "active" class and find the first line without "active" class to activate it
        for (let i = 0; i < elems.length; i++) {
            if (elems[i].classList.contains(styles.lineSecurityActive)) {
                lastLineActive = elems[i]
            } else {
                lineToActivate = elems[i]
                break
            }
        }
    }

    const [isSafe, setIsSafe] = useState({
        size: false,
        maj: false,
        num: false,
        sym: false,
    })

    const onChangeIsSafe = (updatedValue: any) => {
        setIsSafe((isSafe) => ({
            ...isSafe,
            ...updatedValue,
        }))
    }

    const strength = () => {
        let data = Object.entries(isSafe).filter(([key, value]) => value)

        if (data.length === 1 || data.length === 2) {
            return 'faible'
        } else if (data.length === 3) {
            return 'moyen'
        } else if (data.length === 4) {
            return 'fort'
        } else {
            return ''
        }
    }

    // regular expressions to validate password
    var lowerCase = /[a-z]/g
    var upperCase = /[A-Z]/g
    var numbers = /[0-9]/g
    var symbol = /[^a-zA-Z0-9]/g

    searchLineActive()

    // Check if password length is validated => add "active" on first line without "active" class
    if (!isSafe.size && password.length >= 12 && lineToActivate !== undefined) {
        lineToActivate.classList.add(styles.lineSecurityActive)
        searchLineActive()
        onChangeIsSafe({ size: true })
    }

    // Check if password length is no longer validated => remove "active" on first line without "active" class
    if (isSafe.size && password.length < 12 && lastLineActive !== undefined) {
        lastLineActive.classList.remove(styles.lineSecurityActive)
        searchLineActive()
        onChangeIsSafe({ size: false })
    }

    // Check if lowerCase and upperCase regex are validated => add "active" on first line without "active" class
    if (
        !isSafe.maj &&
        password.match(upperCase) &&
        password.match(lowerCase) &&
        lineToActivate !== undefined
    ) {
        lineToActivate.classList.add(styles.lineSecurityActive)
        searchLineActive()
        onChangeIsSafe({ maj: true })
    }

    // Check if lowerCase or upperCase regex are no longer validated => remove "active" on last line with "active" class
    if (
        isSafe.maj &&
        (!password.match(upperCase) || !password.match(lowerCase)) &&
        lastLineActive !== undefined
    ) {
        lastLineActive.classList.remove(styles.lineSecurityActive)
        searchLineActive()
        onChangeIsSafe({ maj: false })
    }

    // Check if number regex is validated => add "active" on first line without "active" class
    if (!isSafe.num && password.match(numbers) && lineToActivate !== undefined) {
        lineToActivate.classList.add(styles.lineSecurityActive)
        searchLineActive()
        onChangeIsSafe({ num: true })
    }

    // Check if number regex is no longer validated => remove "active" on last line with "active" class
    if (isSafe.num && !password.match(numbers) && lastLineActive !== undefined) {
        lastLineActive.classList.remove(styles.lineSecurityActive)
        searchLineActive()
        onChangeIsSafe({ num: false })
    }

    // Check if symbol regex is validated => add "active" on first line without "active" class
    if (!isSafe.sym && password.match(symbol) && lineToActivate !== undefined) {
        lineToActivate.classList.add(styles.lineSecurityActive)
        searchLineActive()
        onChangeIsSafe({ sym: true })
    }

    // Check if symbol regex is no longer validated => remove "active" on last line with "active" class
    if (isSafe.sym && !password.match(symbol) && lastLineActive !== undefined) {
        lastLineActive.classList.remove(styles.lineSecurityActive)
        searchLineActive()
        onChangeIsSafe({ sym: false })
    }

    return {
        password,
        setPassword,
        isSafe,
        strength,
    }
}
