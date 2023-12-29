'use client'

import {
    AutocompleteValue,
    Box,
    ClickAwayListener,
    TextField,
    UseAutocompleteProps,
    UseAutocompleteReturnValue,
} from '@mui/material'
import { _, _l } from '@/utils/i18n'
import { useAutocomplete } from '@mui/material'
import { Dropdown, InputWrapper, List, StyledTag } from './ModelSelectStyles'
import CheckIcon from '@mui/icons-material/Check'
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'
import { observer } from 'mobx-react'

export interface ModelSelectProps<
    Value,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
> extends Omit<UseAutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>, 'onChange'> {
    label?: React.ReactNode
    onChange?: (value: Value) => void
    onOpenOnce?: (
        params: UseAutocompleteReturnValue<Value, Multiple, DisableClearable, FreeSolo>
    ) => void
    renderValue?: (
        params: UseAutocompleteReturnValue<Value, Multiple, DisableClearable, FreeSolo> & {
            renderedValue: React.ReactNode
        }
    ) => React.ReactNode
    renderOption?: (
        params: UseAutocompleteReturnValue<Value, Multiple, DisableClearable, FreeSolo> & {
            option: Value
            index: number
            renderedOption: React.ReactNode
        }
    ) => React.ReactNode
    renderOptions?: (
        params: UseAutocompleteReturnValue<Value, Multiple, DisableClearable, FreeSolo> & {
            renderedOptions: React.ReactNode
        }
    ) => React.ReactNode
}

export default function ModelSelect<
    Value = string,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
>({
    label,
    onChange,
    onOpenOnce,
    renderValue = (params) => params.renderedValue,
    renderOption = (params) => params.renderedOption,
    renderOptions = (params) => params.renderedOptions,
    ...props
}: ModelSelectProps<Value, Multiple, DisableClearable, FreeSolo>) {
    //
    const loading = false
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [openOnce, setOpenOnce] = useState(false)
    let params: UseAutocompleteReturnValue<Value, Multiple, DisableClearable, FreeSolo>

    const handleChange = (
        event: SyntheticEvent<Element, Event>,
        value: AutocompleteValue<Value, Multiple, DisableClearable, FreeSolo>
    ) => {
        setInputValue('')
        onChange?.(value as Value)
        setOpen(false)
    }

    const onInputChange = (event: SyntheticEvent<Element, Event>, value: string) => {
        setInputValue(value)
        setOpen(true)
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue(event.target.value)
    }

    params = useAutocomplete<Value, Multiple, DisableClearable, FreeSolo>({
        inputValue,
        open,
        onChange: handleChange,
        // onOpen: handleOpen,
        // onInutChange: onInputChange,
        ...props,
    })

    useEffect(() => {
        if (open && !openOnce) {
            setOpenOnce(true)
            onOpenOnce?.(params)
        }
    }, [open])

    const values = params.value
        ? Array.isArray(params.value)
            ? params.value
            : [params.value]
        : props.value
        ? [props.value]
        : []

    const renderedValue = (
        <Box sx={{ display: 'flex' }} onClick={() => setOpen(true)}>
            {values.map((option, index: number) => (
                <StyledTag
                    label={props.getOptionLabel?.(option) ?? `${option}`}
                    {...params.getTagProps({ index })}
                    multiple={props.multiple}
                />
            ))}
            <input {...params.getInputProps()} style={{ display: 'none' }} />
        </Box>
    )

    const renderedOptions = (params.groupedOptions as Value[]).map((option, index) => {
        const renderedOption = (
            <li {...params.getOptionProps({ option, index })}>
                <span>{props.getOptionLabel?.(option) ?? `${option}`}</span>
                <CheckIcon fontSize="small" />
            </li>
        )
        return renderOption({ ...params, option, index, renderedOption })
    })
    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box
                sx={(theme) => ({
                    position: 'relative',
                    zIndex: '100000',
                    display: 'flex',
                    flexGrow: '1 1 auto',
                    gap: 1,
                    alignItems: 'center',
                    color:
                        theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.65)'
                            : 'rgba(0,0,0,.85)',
                    fontSize: '14px',
                })}
            >
                {label && <Box sx={{}}>{label} : </Box>}
                <Box
                    sx={(theme) => ({
                        position: 'relative',
                        zIndex: '100000',
                    })}
                >
                    <div {...params.getRootProps()}>
                        <InputWrapper
                            ref={params.setAnchorEl}
                            className={params.focused ? 'focused' : ''}
                        >
                            {renderValue({ ...params, renderedValue })}
                        </InputWrapper>
                    </div>
                    {params.groupedOptions.length > 0 || open ? (
                        <Dropdown>
                            <TextField
                                placeholder={_l('rechercher')}
                                size="small"
                                value={inputValue}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                }}
                            />
                            <List {...params.getListboxProps()}>
                                {renderOptions({ ...params, renderedOptions })}
                            </List>
                        </Dropdown>
                    ) : null}
                </Box>
            </Box>
        </ClickAwayListener>
    )
}
