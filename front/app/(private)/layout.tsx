import RequireUser from '@/patterns/account/RequireUser'
import ThemeProvider from '@/themes/ThemeProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        // <RequireUser mode="modal" authenticated>
        <ThemeProvider>{children}</ThemeProvider>
        /* </RequireUser> */
    )
}
