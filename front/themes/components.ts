import { Theme, ThemeOptions } from '@mui/material/styles'
import { magenta, placeholder, tertiary } from './constants'
import { primaryFont, secondaryFont } from './typography'
import NextLink from 'next/link'

declare module '@mui/material/Button' {
    interface ButtonPropsSizeOverrides {
        larger: true
    }
}

export function alterComponents(theme: Theme, options: ThemeOptions) {
    //
    options.components = { ...options.components }
    //
    options.components.MuiCssBaseline = {
        styleOverrides: {
            body: {
                fontFamily: primaryFont.style.fontFamily,
                fontStyle: 'normal',
                lineHeight: 'normal',
                fontDisplay: 'swap',
                fontWeight: '500',
                fontSize: '1.125rem',
                letterSpacing: '1',
            },
        },
    }

    // ██╗     ██╗███╗   ██╗██╗  ██╗
    // ██║     ██║████╗  ██║██║ ██╔╝
    // ██║     ██║██╔██╗ ██║█████╔╝
    // ██║     ██║██║╚██╗██║██╔═██╗
    // ███████╗██║██║ ╚████║██║  ██╗
    // ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
    options.components.MuiLink = {
        defaultProps: {
            // component: NextLink,
            color: theme.palette.tertiary.main,
        },
    }

    // ██████╗ ██████╗ ███████╗ █████╗ ██████╗  ██████╗██████╗ ██╗   ██╗███╗   ███╗██████╗ ███████╗
    // ██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗██║   ██║████╗ ████║██╔══██╗██╔════╝
    // ██████╔╝██████╔╝█████╗  ███████║██║  ██║██║     ██████╔╝██║   ██║██╔████╔██║██████╔╝███████╗
    // ██╔══██╗██╔══██╗██╔══╝  ██╔══██║██║  ██║██║     ██╔══██╗██║   ██║██║╚██╔╝██║██╔══██╗╚════██║
    // ██████╔╝██║  ██║███████╗██║  ██║██████╔╝╚██████╗██║  ██║╚██████╔╝██║ ╚═╝ ██║██████╔╝███████║
    // ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝  ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═════╝ ╚══════╝
    options.components.MuiBreadcrumbs = {
        defaultProps: {
            separator: '>',
        },
        styleOverrides: {
            root: {
                fontFamily: secondaryFont.style.fontFamily,
                fontWeight: '400',
                fontSize: '0.875rem',
                color: '#C4C4C4',
            },
            separator: {
                color: '#C4C4C4',
                fontWeight: '300',
            },
            li: {
                '& a': {
                    color: '#C4C4C4',
                    fontWeight: '300',
                    textDecoration: 'underline',
                    '&.selected': {
                        textDecoration: 'none',
                    },
                },
            },
        },
    }

    // ██████╗ ██╗   ██╗████████╗████████╗ ██████╗ ███╗   ██╗███████╗
    // ██╔══██╗██║   ██║╚══██╔══╝╚══██╔══╝██╔═══██╗████╗  ██║██╔════╝
    // ██████╔╝██║   ██║   ██║      ██║   ██║   ██║██╔██╗ ██║███████╗
    // ██╔══██╗██║   ██║   ██║      ██║   ██║   ██║██║╚██╗██║╚════██║
    // ██████╔╝╚██████╔╝   ██║      ██║   ╚██████╔╝██║ ╚████║███████║
    // ╚═════╝  ╚═════╝    ╚═╝      ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝
    options.components.MuiButtonBase = {
        defaultProps: {
            // disableRipple: true,
        },
    }

    //
    options.components.MuiButton = {
        defaultProps: {
            // disableRipple: true,
            variant: 'contained',
        },
        variants: [
            {
                props: { size: 'small' },
                style: {
                    // padding: '0.6rem 1rem',
                    padding: '0.9rem 1.75rem',
                    fontSize: '0.875rem',
                    letterSpacing: '-0.01406rem',
                    fontWeight: '400',
                    minHeight: '30px',
                },
            },
            {
                props: { size: 'medium' },
                style: {
                    // padding: '0.6rem 1rem',
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.875rem',
                    letterSpacing: '-0.01406rem',
                    fontWeight: '500',
                },
            },
            {
                props: { size: 'large' },
                style: {
                    padding: '1.25rem 2rem',
                    fontSize: '1.25rem',
                    fontWeight: '400',
                },
            },
            {
                props: { size: 'larger' },
                style: {
                    padding: '1.25rem 2rem',
                    fontSize: '1.25rem',
                    fontWeight: '400',
                },
            },
        ],
        styleOverrides: {
            root: {
                textAlign: 'center',
                borderRadius: '1.875rem',
                textTransform: 'none',
                fontStyle: 'normal',
                lineHeight: 'normal',
                letterSpacing: '-0.01406rem',
            },
            sizeSmall: {
                padding: '0.3rem 1.5rem',
                lineHeight: '0.5rem',
            },
            sizeLarge: {
                padding: '1.25rem 2rem',
            },
            outlinedPrimary: {
                color: tertiary,
                borderColor: tertiary,
            },
        },
    }

    // ██╗███╗   ██╗██████╗ ██╗   ██╗████████╗███████╗
    // ██║████╗  ██║██╔══██╗██║   ██║╚══██╔══╝██╔════╝
    // ██║██╔██╗ ██║██████╔╝██║   ██║   ██║   ███████╗
    // ██║██║╚██╗██║██╔═══╝ ██║   ██║   ██║   ╚════██║
    // ██║██║ ╚████║██║     ╚██████╔╝   ██║   ███████║
    // ╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝    ╚═╝   ╚══════╝

    options.components.MuiTextField = {
        defaultProps: {
            variant: 'filled',
            inputProps: {},
        },
        styleOverrides: {
            root: {
                borderRadius: '1.875rem',
                textTransform: 'none',
                '& .MuiFilledInput-input': {
                    padding: '0.54rem 0.62rem 0.54rem 0.62rem',
                },
                '& .MuiInputBase-root': {
                    borderRadius: '1.875rem',
                    textTransform: 'none',
                    backgroundColor: 'white',
                },
                '& ::placeholder': {
                    color: placeholder,
                    opacity: 1,
                    fontSize: '0.875rem',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 'normal',
                },
                '& .MuiFilledInput-root.Mui-focused  ': {
                    backgroundColor: 'white',
                },
                '& .MuiFilledInput-root:hover': {
                    backgroundColor: 'white',
                },
            },
        },
    }

    options.components.MuiInputLabel = {
        defaultProps: {
            // shrink: true,
        },
        styleOverrides: {
            root: {
                fontWeight: '400',
            },
            shrink: {
                // left: 0, //'50%',
                // // transform: 'translate(0, -10px) scale(0.60)',
                // // fontSize: '1.2rem',
                // background: 'white',
                // padding: '0.3rem 0.5rem',
                // borderRadius: '1.875rem',
                // fontWeight: '400',
            },
        },
    }

    options.components.MuiSelect = {
        defaultProps: {
            variant: 'filled',
            inputProps: {},
        },
        styleOverrides: {
            root: {
                borderRadius: '1.875rem',
                textTransform: 'none',
                textAlign: 'start',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                '& .MuiSelect-select': {
                    padding: '0.54rem 0 0.54rem 0.52rem !important',
                    alignItems: 'center !important',
                    display: 'flex',
                },
                '& .MuiSelect-select .notranslate::after': {
                    color: placeholder,
                    opacity: 1,
                    fontSize: '0.875rem',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 'normal',
                },
                '& .MuiBox-root': {
                    color: placeholder,
                    opacity: 1,
                    fontSize: '0.875rem',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 'normal',
                    height: 'min-content',
                    margin: 'auto 0',
                },
                '& :hover': {
                    borderRadius: '1.875rem',
                },
                '&.Mui-focused': {
                    backgroundColor: 'white',
                },
            },
        },
    }

    options.components.MuiInputBase = {
        styleOverrides: {
            root: {
                borderRadius: '1.875rem',
                paddingLeft: '0.7rem',
                textTransform: 'none',
                backgroundColor: 'white',
            },
        },
    }

    options.components.MuiFilledInput = {
        styleOverrides: {
            root: {
                '&::before': {
                    display: 'none',
                },
                '&::after': {
                    display: 'none',
                    left: 25,
                    right: 25,
                },
            },
            inputSizeSmall: {
                padding: '0.5rem',
            },
        },
    }

    options.components.MuiOutlinedInput = {
        styleOverrides: {
            root: {},
            inputSizeSmall: {
                padding: '0.55rem',
            },
            notchedOutline: {
                // display: 'none',
            },
        },
    }
    // ████████╗ ██████╗  ██████╗ ██╗  ████████╗██╗██████╗
    // ╚══██╔══╝██╔═══██╗██╔═══██╗██║  ╚══██╔══╝██║██╔══██╗
    //    ██║   ██║   ██║██║   ██║██║     ██║   ██║██████╔╝
    //    ██║   ██║   ██║██║   ██║██║     ██║   ██║██╔═══╝
    //    ██║   ╚██████╔╝╚██████╔╝███████╗██║   ██║██║
    //    ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚═╝   ╚═╝╚═╝
    options.components.MuiTooltip = {
        styleOverrides: {
            tooltip: {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.primary.main,
                // boxShadow: options.shadows[13],
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                fontSize: 11,
            },
            arrow: {
                color: theme.palette.common.white,
            },
        },
    }

    // ████████╗██╗   ██╗██████╗  ██████╗  ██████╗ ██████╗  █████╗ ██████╗ ██╗  ██╗██╗   ██╗
    // ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔═══██╗██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██║  ██║╚██╗ ██╔╝
    //    ██║    ╚████╔╝ ██████╔╝██║   ██║██║  ██:q█╗██████╔╝███████║██████╔╝███████║ ╚████╔╝
    //    ██║     ╚██╔╝  ██╔═══╝ ██║   ██║██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══██║  ╚██╔╝
    //    ██║      ██║   ██║     ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██║     ██║  ██║   ██║
    //    ╚═╝      ╚═╝   ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝   ╚═╝

    options.components.MuiTypography = {
        variants: [
            {
                props: { variant: 'h1' },
                style: {
                    fontSize: '36px',
                    fontWeight: '700',
                    lineHeight: '60px' /* 166.667% */,
                    letterSpacing: '-0.01875rem',

                    [theme.breakpoints.only('xs')]: {
                        fontSize: '1.25rem',
                        lineHeight: '2.25rem',
                    },
                    [theme.breakpoints.only('sm')]: {
                        fontSize: '1.50rem',
                        lineHeight: '2.25rem',
                    },
                    [theme.breakpoints.only('md')]: {
                        fontSize: '1.7rem',
                        lineHeight: '2.5rem',
                    },
                },
            },
            {
                props: { variant: 'h2' },
                style: {
                    fontSize: '28px',
                    fontWeight: '500',
                },
            },
            {
                props: { variant: 'h3' },
                style: {
                    fontSize: '18px',
                    fontWeight: '500',
                },
            },
            {
                props: { variant: 'h4' },
                style: {
                    fontSize: '14px',
                    fontWeight: '700',
                },
            },
            {
                props: { variant: 'body1' },
                style: {
                    fontSize: '14px',
                    fontWeight: '700',
                    lineHeight: '1.5rem',

                    [theme.breakpoints.down('sm')]: {
                        fontSize: '0.8rem',
                        lineHeight: '1.1rem',
                    },
                    [theme.breakpoints.down('md')]: {
                        fontSize: '0.9rem',
                        lineHeight: '1.2rem',
                    },
                },
            },
            {
                props: { variant: 'body2' },
                style: {
                    fontFamily: secondaryFont.style.fontFamily,
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '20px' /* 142.857% */,
                    [theme.breakpoints.only('xs')]: {
                        fontSize: '0.8rem',
                    },
                },
            },
            {
                props: { variant: 'caption' },
                style: {
                    fontWeight: '500',
                    fontSize: '1.125rem',
                },
            },
            {
                props: { variant: 'p' },
                style: {
                    marginBottom: 0,
                },
            },
        ],
        styleOverrides: {
            root: {
                fontFamily: primaryFont.style.fontFamily,
                fontStyle: 'normal',
                lineHeight: 'normal',
                '& b': {},
                '& .red': {
                    color: magenta,
                },
            },
        },
    }
    // options.components.MuiTypography = {
    //     variants: [
    //         {
    //             props: { variant: 'text' },
    //             style: {
    //                 fontSize: '1.25rem',
    //                 fontWeight: '700',
    //                 letterSpacing: '-0.01875rem',
    //             },
    //         },
    //     ],
    //     styleOverrides: {},
    // }

    // ████████╗ █████╗ ██████╗ ███████╗
    // ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝
    //    ██║   ███████║██████╔╝███████╗
    //    ██║   ██╔══██║██╔══██╗╚════██║
    //    ██║   ██║  ██║██████╔╝███████║
    //    ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝
    options.components.MuiTab = {
        styleOverrides: {
            root: {
                color: theme.palette.secondary.main,
            },
        },
    }
    // ███████╗███╗   ██╗ █████╗ ██╗  ██╗███████╗██████╗  █████╗ ██████╗
    // ██╔════╝████╗  ██║██╔══██╗██║ ██╔╝██╔════╝██╔══██╗██╔══██╗██╔══██╗
    // ███████╗██╔██╗ ██║███████║█████╔╝ █████╗  ██████╔╝███████║██████╔╝
    // ╚════██║██║╚██╗██║██╔══██║██╔═██╗ ██╔══╝  ██╔══██╗██╔══██║██╔══██╗
    // ███████║██║ ╚████║██║  ██║██║  ██╗███████╗██████╔╝██║  ██║██║  ██║
    // ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝

    options.components.MuiSnackbar = {
        styleOverrides: {
            root: {
                marginTop: '40px',
            },
        },
        defaultProps: {
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            autoHideDuration: 3000,
        },
    }

    //  █████╗ ██╗     ███████╗██████╗ ████████╗███████╗
    // ██╔══██╗██║     ██╔════╝██╔══██╗╚══██╔══╝██╔════╝
    // ███████║██║     █████╗  ██████╔╝   ██║   █████╗
    // ██╔══██║██║     ██╔══╝  ██╔══██╗   ██║   ██╔══╝
    // ██║  ██║███████╗███████╗██║  ██║   ██║   ███████╗
    // ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
    options.components.MuiAlert = {
        styleOverrides: {
            root: {
                // backgroundColor: theme.palette.primary.main,
                // color: theme.palette.common.white,
                borderRadius: '1.875rem',
                fontSize: '1rem',
                fontWeight: '400',
                lineHeight: 'normal',
                padding: '0.5rem 1rem',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            },
        },
    }
}
