export class DateHelper {

    private static datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/

    static isValidStringDate(date: string): boolean {
        return this.datePattern.test(date)
    }
}