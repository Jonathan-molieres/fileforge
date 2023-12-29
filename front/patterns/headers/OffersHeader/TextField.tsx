import TextField from '@/generic/TextField'
import { _ } from '@/utils/i18n'
import { Box } from '@mui/material'
import { observer } from 'mobx-react'
import Image from 'next/image'
import React from 'react'

export default observer(function OffersTextField({
    startIcon,
    label,
    onChange,
    name,
    value,
    ...props
}: {
    startIcon: {
        src: string
        width: number
        height: number
    }
    onChange?: (value: string, name: string) => void
    label: React.ReactNode | string
    name: string
    value?: string
}) {
    return (
        <TextField
            fullWidth
            sx={{
                alignItems: 'center',
                '& .MuiInputBase-root': {
                    display: 'flex',
                    alignItems: 'center',
                },
            }}
            onChange={(value) => onChange?.(value, name)}
            label={label?.toString() as string}
            value={value}
            InputProps={{
                startAdornment: (
                    <Box
                        sx={{
                            display: 'grid',
                            placeItems: 'center',
                        }}
                    >
                        <Image
                            src={startIcon.src}
                            alt={label as string}
                            width={startIcon.width}
                            height={startIcon.height}
                            style={{
                                margin: 'auto',
                            }}
                        />
                    </Box>
                ),
            }}
            {...props}
        />
    )
})
