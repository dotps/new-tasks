export class ObjectHelper {

    static excludeField<T, K extends keyof T>(data: T, excludeField: K): T {
        const { [excludeField]: _, ...otherFields } = data;
        return otherFields as T;
    }
}