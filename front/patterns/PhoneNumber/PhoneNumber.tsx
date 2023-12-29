import { Box, SxProps, Tooltip } from '@mui/material'
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled'
import parsePhoneNumber, {
    isPossiblePhoneNumber,
    isValidPhoneNumber,
    validatePhoneNumberLength,
} from 'libphonenumber-js'

interface PhoneNumberProps {
    number?: string | number
    sx?: SxProps
    children?: React.ReactNode
}

export default function PhoneNumber({ number, children, sx }: PhoneNumberProps) {
    const phoneNumber = number ? parsePhoneNumber(`${number}`, 'FR') : undefined
    const fallback = number //: <PhoneDisabledIcon color="error" />

    return (
        <Tooltip title={<>Pays : {phoneNumber?.country}</>}>
            <Box
                sx={{
                    display: 'grid',
                    gap: 2,
                    whiteSpace: 'nowrap',
                    ...sx,
                }}
            >
                {phoneNumber ? phoneNumber.formatInternational() : fallback}
                {children}
            </Box>
        </Tooltip>
    )
}
