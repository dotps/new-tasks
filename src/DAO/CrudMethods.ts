export type CrudMethods<TData> = {
    create: (data: { data: TData }) => Promise<TData>
    update: (data: { where: { id: number }; data: Partial<TData> }) => Promise<TData>
    delete: (data: { where: { id: number } }) => Promise<TData>
    findUnique: (data: { where: { id: number } }) => Promise<TData | null>
}