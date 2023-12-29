'use client'
import { _ } from '@/utils/i18n'
import { Checkbox, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select'
import { SxProps } from '@mui/system'
import { observer } from 'mobx-react'
import Image from 'next/image'
import React from 'react'

export default observer(function Select({
    startIcon,
    label,
    menuItems = [],
    value = [],
    placeholderSx,
    name,
    menuItemSx,
    onChange,
    ...props
}: {
    startIcon?: {
        src: string
        width: number
        height: number
    }
    label: React.ReactNode | string
    menuItems?: { label: string; value: string }[]
    value?: string[] | string
    onChange?: (value: string[], name: string) => void
    placeholderSx?: SxProps
    name: 'sector' | 'contractTypes' | 'salaryRanges'
    menuItemSx?: SxProps
}) {
    const handleChange = (event: SelectChangeEvent<any>) => {
        onChange?.(event.target.value, name)
    }
    const arrayValue = Array.isArray(value) ? value : [value]

    return (
        <FormControl
            sx={{
                '& :hover': {
                    backgroundColor: 'white !important',
                },
            }}
        >
            <MuiSelect
                displayEmpty
                multiple
                value={arrayValue}
                label={label?.toString()}
                startAdornment={
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pl: (startIcon && '1rem') || '2rem',
                        }}
                    >
                        {startIcon && (
                            <Image
                                src={startIcon.src}
                                width={startIcon.width}
                                height={startIcon.height}
                                alt={label?.toString() ?? "icon d'input"}
                            />
                        )}
                    </Box>
                }
                renderValue={() => {
                    if (arrayValue.length === 0) {
                        return (
                            <Box
                                sx={{
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    display: 'flex',
                                    opacity: 0.5,
                                    ...placeholderSx,
                                }}
                            >
                                {label}
                            </Box>
                        )
                    } else return arrayValue.map((item) => item).join(', ')
                }}
                onChange={handleChange}
                sx={{
                    minWidth: { xs: '100%', md: '16.25rem' },
                    p: 0,
                    '& .MuiSelect-select': {
                        p: '1rem',
                    },
                }}
            >
                {menuItems.map((item) => (
                    <MenuItem sx={{ ...menuItemSx }} value={item.value}>
                        <Checkbox checked={arrayValue?.includes(item.value)} />
                        <Typography>{item.label}</Typography>
                    </MenuItem>
                ))}
            </MuiSelect>
        </FormControl>
    )
})
