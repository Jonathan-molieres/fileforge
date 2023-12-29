import { Montserrat, Poppins } from 'next/font/google'

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        text: true
        p: true
    }
}

export const primaryFont = Poppins({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
})

export const secondaryFont = Montserrat({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
})
