import ThemeProvider from '@/themes/ThemeProvider'
import * as React from 'react'
import './styles.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link href="favicon.ico" rel="icon" media="(prefers-color-scheme: light)" />
                <link href="favicon-dark.ico" rel="icon" media="(prefers-color-scheme: dark)" />
            </head>
            <body>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    )
}
