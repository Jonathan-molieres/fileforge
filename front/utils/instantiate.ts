type valueof<T> = T[keyof T]
// @ts-ignore
type ValueOf<T, field = string> = T[field]
type Transformer<D, I, field> = (value: D) => ValueOf<I, field> | undefined

export default function instantiate<I, D extends {}>(
    instance: I,
    data: D,
    transformers?: { [field in keyof D]?: Transformer<D[field], I, field> }
) {
    Object.entries<valueof<D>>(data).forEach(([field, value]) => {
        if (value !== undefined) {
            const transformer = transformers?.[field as keyof D]
            // @ts-ignore
            instance[field as valueof<I>] =
                transformer && value ? transformer(value) : value ?? instance[field] // @ts-ignore
        }
    })
}
