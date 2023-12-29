'use client'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles'
import NextAppDirEmotionCacheProvider from './EmotionCache'
import defaultTheme, { softTheme } from './themes'

export default function ThemeProvier({
    children,
    theme,
}: {
    children: React.ReactNode
    theme?: 'default' | 'soft'
}) {
    return (
        <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
            <MuiThemeProvider theme={theme === 'soft' ? softTheme : defaultTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </NextAppDirEmotionCacheProvider>
    )
}
