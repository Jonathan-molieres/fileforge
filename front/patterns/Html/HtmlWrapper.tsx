'use client'

import { Box, Typography } from '@mui/material'
import theme from '@/themes/themes'

export default function HtmlWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Box
            // @ts-ignore
            sx={{
                '& h2': { ...theme.typography.h2 },
                '& h3': { ...theme.typography.h3 },
                '& p': { ...theme.typography.body2, wordBreak: 'break-word', my: '0.2rem' },
                '& a': {
                    ...theme.components?.MuiLink,
                    wordBreak: 'break-word',
                    color: 'primary.main',
                },
                '& ul': {
                    ...theme.components?.MuiList,
                    wordBreak: 'break-word',
                    '& ::marker': {
                        fontSize: '0.75rem',
                    },
                },
                '& li': {
                    ...theme.components?.MuiListItem,
                    ...theme.typography.body2,
                },
                '& >p:first-child': {
                    mt: 0,
                },
            }}
        >
            {children}
        </Box>
    )
}
