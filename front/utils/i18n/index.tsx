import parseHTML from 'html-react-parser'
import { action, makeObservable, observable } from 'mobx'
import React from 'react'
import cookies from '../cookies'
import Gettext from './Gettext'

export const getLanguageLabel = (language: string): string => {
    let label: string
    try {
        label = `${new Intl.DisplayNames([language], { type: 'language' }).of(language)}`
    } catch (e) {
        label = `${new Intl.DisplayNames(['fr'], { type: 'language' }).of('fr')}`
    }
    return label.charAt(0).toUpperCase() + label.slice(1)
}

export interface JedTranslations {
    domain: string
    locale_data: {
        messages: { [value: string]: string[] }
    }
}
export interface Language {
    label?: string
    flag?: any
    translations: JedTranslations
}

export interface Languages {
    [language: string]: Language
}

interface GettextOptions {
    html?: boolean
    count?: number
    valuePlural?: string
    data?: { [key: string]: any }
    asString?: boolean
}

// String
export const _ = (value?: string, options: GettextOptions = {}) => {
    return typeof window === 'undefined' || options.asString ? (
        i18n.getTranslation(value, options)
    ) : (
        <Gettext i18n={i18n} value={value} options={options} />
    )
}

// Lazy
export const _l = (value: string, options: GettextOptions = {}): string => {
    return `${i18n.getTranslation(value, options)}`
}

// Plural 1, 2
export const _p = (
    value: string,
    valuePlural: string,
    options: GettextOptions = {}
): React.ReactNode => {
    return _(options?.count ?? 0 > 0 ? valuePlural : value, options)
}

// Context 1, 2
export const _c = (
    context: string,
    value: string,
    options: GettextOptions = {}
): React.ReactNode => {
    return _(value, options)
}

class I18n {
    //
    language: string = cookies.get('language', this.navigatorLanguage)
    languages: Languages = {}
    availableLanguages: string[] = (process.env.NEXT_PUBLIC_LANGUAGES ?? 'fr,en').split(',')

    constructor() {
        Object.entries(this.languages).map(([language, data]) => {
            data.label = getLanguageLabel(language)
        })
        makeObservable(this, {
            language: observable,
            languages: observable,
            setLanguage: action,
            loadLanguage: action,
        })

        this.loadLanguages()
    }

    get navigatorLanguage(): string {
        return 'fr' //navigator?.language.split("-")[0];
    }

    setLanguage(language: string): void {
        this.language = language
        cookies.set('language', language)
    }

    getLanguage(
        fct: ({ key, label }: { key: string; label: string }) => React.ReactNode
    ): React.ReactNode {
        return (
            <>
                {(): any =>
                    fct({
                        key: this.language,
                        label: this.languages[this.language]?.label ?? '',
                    })
                }
            </>
        )
    }

    getTranslation(
        value?: string,
        { html = false, count = 0, valuePlural, data = {} }: GettextOptions = {}
    ): React.ReactNode {
        if (!value) return value
        // _('opportunité', 'opportunités', { count: 2 })
        let index = 1
        let message = value
        if (valuePlural && count && count > 1) {
            index = 2
            message = valuePlural
        }
        // Get the translated messages
        const messages =
            this.languages[this.language]?.translations?.locale_data?.messages?.[value] ?? []
        //  NORMAL FR [null, ""]
        //  NORMAL EN [null, "opportunity"]
        //  PLURAL FR ["opportunités", "", ""]
        //  PLURAL EN ["opportunités", "opportunity", "opportunities"]
        if (messages[index] && messages[index] !== '') {
            message = messages[index]
        }
        if (data) {
            Object.entries(data).map(([key, value]) => {
                // message = message.toString().replace(`\${${key}}`, value);
                message = message.toString().replace(`%(${key})s`, value)
            })
        }
        if (html) {
            return parseHTML(message as string)
        } else {
            return message
        }
    }

    mapLanguages(
        iteratee: (data: Language & { key: string; selected: boolean }) => any
    ): React.ReactNode {
        const iterateeProxy = () =>
            Object.entries(this.languages).map(([key, data]) =>
                iteratee({ ...data, key, selected: key === this.language })
            )
        return typeof window === 'undefined' ? iterateeProxy() : <>{(): any => iterateeProxy()}</>
    }

    loadLanguage(key: string, language: any): void {
        this.languages = { ...this.languages, [key]: language }
    }
    loadLanguages(): void {
        this.availableLanguages.map(async (language) => {
            let translations = {}
            try {
                translations = (await import(`../../locales/${language}.json`))
                    .default as JedTranslations
                this.loadLanguage(language, {
                    translations,
                    label: getLanguageLabel(language),
                })
            } catch (e) {
                console.error(e)
            }
        })
    }
}

export const i18n = new I18n()
export default i18n
