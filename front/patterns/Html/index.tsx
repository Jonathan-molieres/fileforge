'use client'

import { useMemo } from 'react'
import parseHtml, { attributesToProps, domToReact } from 'html-react-parser'
import HtmlWrapper from './HtmlWrapper'
import { Box, Typography } from '@mui/material'
import React from 'react'

export default function Html({ html: defaultHtml }: { html?: string }) {
    /* Usage: 
        <Html html={html} /> 
    */
    const cleanHtml = useMemo(() => {
        let html = defaultHtml
        if (!html) return ''
        html = html.replace(/https:\/\/workandyou.fr\//g, '/')
        html = html.replace(/https:\/\/www.workandyou.fr\//g, '/')
        html = html.replace(/http:\/\/workandyou.fr\//g, '/')
        html = html.replace(/http:\/\/www.workandyou.fr\//g, '/')
        html = html.replace(/www.workandyou.fr\//g, '/')
        html = html.replace(/(href=".*?)(#)/g, '$1')
        html = html.replace(/(src|href)="\/static\//g, '$1="https://workandyou.fr/static/')
        // html = html.replace(/#([a-zA-Z\u00C0-\u017F]+)/gi, '<a href="/tags/$1">#$1</a>')
        return html
    }, [defaultHtml])

    return (
        <Box>
            {parseHtml(cleanHtml, {
                transform(reactNode, domNode, index) {
                    if (typeof reactNode === 'string') return reactNode
                    console.log(reactNode, domNode)
                    switch (domNode.tagName) {
                        case 'h1':
                        case 'h2':
                        case 'h3':
                        case 'h4':
                        case 'h5':
                        case 'h6':
                            return React.createElement(
                                Typography,
                                { variant: domNode.tagName },
                                reactNode.props.children
                            )
                            break
                        case 'p':
                            return React.createElement(
                                Typography,
                                { variant: 'body2', py: '10px' },
                                reactNode.props.children
                            )
                            break
                        default:
                            return reactNode
                            break
                    }
                },
            })}
        </Box>
    )
}
