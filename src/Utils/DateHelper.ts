export class DateHelper {

    private static dateLongPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/
    private static dateShortPattern = /^\d{4}-\d{2}-\d{2}$/

    static isValidDate(date: Date | string): boolean {
        if (date === null) return false
        if (date instanceof Date) return true

        return this.dateLongPattern.test(date) || this.dateShortPattern.test(date)
    }
}