import { Shadows, createTheme } from '@mui/material'
import type { PaletteColorOptions, Theme, ThemeOptions } from '@mui/material/styles'
import { alterComponents } from './components'
import { grey, placeholder, darKblue, blue, magenta } from './constants'

declare module '@mui/material/styles' {
    interface Palette {
        tertiary: PaletteColor
        placeholder: PaletteColor
    }

    // interface ThemeOptions {
    //     breakpoints:
    // }

    interface PaletteOptions {
        tertiary: PaletteColorOptions
        placeholder: PaletteColorOptions
    }
    interface PaletteColor {
        tertiary: PaletteColor['main']
        placeholder: PaletteColor['main']
    }

    interface SimplePaletteColorOptions {}
}

const themeOptions: ThemeOptions = {
    shadows: Array(25).fill('none') as Shadows,
    // typography: {
    //     fontFamily: [
    //         'YourFontFamily', // Remplacez par le nom de votre police
    //         'sans-serif',
    //     ].join(','),
    // },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    palette: {
        mode: 'light',
        primary: {
            main: darKblue,
        },
        secondary: {
            main: magenta,
        },
        tertiary: {
            main: blue,
        },

        text: {
            primary: darKblue,
            secondary: magenta,
        },
        placeholder: {
            main: placeholder,
        },
        background: {
            default: '#FFFFFF',
            paper: grey,
        },
        divider: '#EEF2F8',
    },
}
let theme = createTheme(themeOptions)
alterComponents(theme, themeOptions)
theme = createTheme(themeOptions)
export default theme

// ███████╗ ██████╗ ███████╗████████╗
// ██╔════╝██╔═══██╗██╔════╝╚══██╔══╝
// ███████╗██║   ██║█████╗     ██║
// ╚════██║██║   ██║██╔══╝     ██║
// ███████║╚██████╔╝██║        ██║
// ╚══════╝ ╚═════╝ ╚═╝        ╚═╝

const solfThemeOptions = {
    // ...themeOptions,
    palette: {
        // ...themeOptions.palette,
        primary: {
            main: blue,
        },
        secondary: {
            main: darKblue,
        },
        tertiary: {
            main: magenta,
        },
        placeholder: {
            main: placeholder,
        },
    },
}
let softTheme = createTheme(solfThemeOptions)
alterComponents(softTheme, solfThemeOptions)
softTheme = createTheme(solfThemeOptions)
export { softTheme }
