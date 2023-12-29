export default function useInstance<ModelData>(
    Model,
    instanceOrData: Partial<Pick<Model | ModelData, keyof Model>>
) {
    const instance = useMemo(() => new this(instanceOrData), [instanceOrData])
    return instance
}
