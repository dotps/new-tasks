export class ObjectHelper {
    static excludeField<T, K extends keyof T>(data: T, excludeField: K): Omit<T, K> {
        const { [excludeField]: _, ...otherFields } = data;
        return otherFields as Omit<T, K>;
    }
}