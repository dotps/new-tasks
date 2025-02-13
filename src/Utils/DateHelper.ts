export class DateHelper {

    private static datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/

    static isValidDate(date: Date | string): boolean {
        if (date === null) return false
        if (date instanceof Date) return true

        return this.datePattern.test(date)

        // const newDate = new Date(date)
        // return !isNaN(newDate.getTime()) ? this.datePattern.test(newDate.toISOString()) : false
    }
}