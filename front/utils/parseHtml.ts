import originalParseHtml, { HTMLReactParserOptions } from 'html-react-parser'

export default function parseHtml(html: string | undefined, options?: HTMLReactParserOptions) {
    if (html) {
        html = html.replaceAll('http://wwww.workandyou.fr/', '/')
        html = html.replaceAll('https://wwww.workandyou.fr/', '/')
        html = html.replaceAll('wwww.workandyou.fr/', '/')

        const parseHtml = originalParseHtml(html, options)
        return parseHtml
    }

    return html
}
