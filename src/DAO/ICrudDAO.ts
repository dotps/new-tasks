export interface ICrudDAO<TData> {
    create(data: Partial<TData>): Promise<TData>
    update(data: Partial<TData>): Promise<TData>
    delete(id: number): Promise<TData>
    getById(id: number): Promise<TData | null>
}