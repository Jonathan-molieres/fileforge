// Encode searchParams with URLSearchParams from object, ignore undefined values
export default function encodeSearchParams(object: {
    [key: string]: string | string[] | number | number[] | boolean | undefined | null
}) {
    const params = new URLSearchParams()

    Object.entries(object).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                value.forEach((item) => params.append(key, item.toString()))
            } else {
                params.append(key, value.toString())
            }
        }
    })

    return params
}
