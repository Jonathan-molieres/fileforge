import { Box } from '@mui/material'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return <Box>{children}</Box>
}
