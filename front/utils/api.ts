import axios, { AxiosError } from 'axios'
import cookies from './cookies'
import { notFound } from 'next/navigation'

export interface Page<T> {
    rows: T[]
    count: number
    limit: number
    page: number
}

export interface APIOptions {
    prefix?: string
}

export interface APIError {
    detail: string
}

export interface RequestOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
    prefix?: string
    data?: any
    params?: {}
    headers?: {
        [key: string]: string
    }
    contentType?: string
}

export interface UseOptions<R> extends RequestOptions {
    passive?: boolean
    transform?: (data: any) => R
}

export interface UseResult<R, E> {
    data: R | undefined
    fetching: boolean
    errors: E | undefined
    request: (options?: UseOptions<R>) => void
}

export class API {
    publicPrefix: string = '/api'
    version: number = 1
    source?: any

    constructor({}: APIOptions = {}) {}

    async get<R = any>(route: string, options: RequestOptions = {}): Promise<R> {
        return await this.request<R>(route, { ...options, method: 'GET' })
    }

    async post<R = any>(route: string, options: RequestOptions = {}): Promise<R> {
        return await this.request<R>(route, { ...options, method: 'POST' })
    }

    async put<R = any>(route: string, options: RequestOptions = {}): Promise<R> {
        return await this.request<R>(route, { ...options, method: 'PUT' })
    }

    async patch<R = any>(route: string, options: RequestOptions = {}): Promise<R> {
        return await this.request<R>(route, { ...options, method: 'PATCH' })
    }

    async delete<R = any>(route: string, options: RequestOptions = {}): Promise<R> {
        return await this.request<R>(route, { ...options, method: 'DELETE' })
    }

    async request<R = any>(route: string, options: RequestOptions = {}): Promise<R> {
        //

        const { method, data, params, headers, contentType } = options
        const cancelToken = axios.CancelToken
        this.source = cancelToken.source()
        // try {
        const url =
            typeof window !== 'undefined'
                ? this.pathJoin(`${this.publicPrefix}/${route}`)
                : `${process.env.API_URL ?? 'http://api:8080'}${this.pathJoin(`${route}`)}`

        // const url = `http://api:8080${this.pathJoin(`${route}`)}`

        // console.warn('API request', url, options)

        try {
            const res = await axios({
                url,
                method: method ?? 'GET',
                params,
                data,
                headers: {
                    'Content-Type': contentType ?? 'application/json',
                    Authorization: `Token ${this.token}`,
                    ...headers,
                },
            })
            if (res.status === 404) {
                throw notFound()
            }
            return await res.data
        } catch (e: any) {
            if (e.response?.status === 404) {
                throw notFound()
            }
        }
    }

    async stop(): Promise<void> {
        try {
            this.source.cancel('Operation canceled by the user.')
            await this.source.token.throwIfRequested()
        } catch (error) {
            return
        }
    }

    get token(): string | undefined {
        const token: any = cookies.get('token')
            ? typeof window !== undefined
                ? localStorage?.getItem('token')
                : undefined
            : undefined
        return token
    }

    pathJoin(path: string, sep = '/') {
        return path.replace(/\/{1,}/g, sep).replace(':/', '://')
    }

    // use<R = any, E = any>(route: string, options?: UseOptions<R>, deps: [] = []): UseResult<R, E> {
    //     const [data, setData] = useState<R | undefined>()
    //     const [fetching, setFetching] = useState(false)
    //     const [errors, setErrors] = useState<E>()

    //     const request = async (requestOptions?: RequestOptions) => {
    //         setFetching(true)
    //         try {
    //             const data: any = await this.request<R>(route, requestOptions)
    //             setData(options?.transform ? options.transform(data) : (data as R))
    //         } catch (e) {
    //             setErrors(e as E)
    //         }
    //         setFetching(false)
    //     }

    //     useEffect(() => {
    //         if (!options?.passive) {
    //             request().then()
    //         }
    //     }, [JSON.stringify(options), ...deps])

    //     return { data, fetching, errors, request }
    // }
}

const api = new API()
export default api
