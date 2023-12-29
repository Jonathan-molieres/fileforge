import { Box, LinearProgress, Typography } from '@mui/material'
import React, { useEffect } from 'react'

export interface LoaderProps {
    children?: React.ReactNode
    loading?: boolean
    centered?: boolean
    defaultMessage?: string
    className?: string
}

export default function Loader({
    children,
    loading,
    centered,
    defaultMessage,
    className,
}: LoaderProps) {
    const [color, setColor] = React.useState<'inherit' | 'primary' | 'secondary'>('primary')

    useEffect(() => {
        const interval = setInterval(() => {
            setColor((color) => (color === 'primary' ? 'secondary' : 'primary'))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <Box
            sx={{
                visibility: loading ? 'visible' : 'hidden',
                opacity: loading ? 1 : 0,
                ...(centered && {
                    position: 'absolute',
                    zIndex: 1,
                    top: '50%',
                    left: '10%',
                    right: '10%',
                    transform: 'translate(0, -50%)',
                    transition: 'opacity 1s ease, visibility 1s ease',
                    '& span': {
                        transition: 'background-color 1s ease',
                    },
                }),
            }}
        >
            {defaultMessage && (
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: 'center',
                        color: 'secondary.main',
                        mb: 2,
                    }}
                >
                    {defaultMessage}
                </Typography>
            )}
            <LinearProgress color={color} />
        </Box>
    )
}
