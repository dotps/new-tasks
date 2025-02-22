import {DateHelper} from "./DateHelper"

export class QueryHelper {
    static parseNumberList(value: string | undefined, separator: string = ","): number[] {
        const incomingList = value?.split(separator) || []
        const resultList: number[] = []
        for (let item of incomingList) {
            item = item.trim()
            if (!item) continue
            const num = Number(item.trim())
            if (!Number.isNaN(num)) resultList.push(num)
        }
        return resultList
    }

    static parseDate(value: string | undefined): Date | undefined {
        if (!value || !DateHelper.isValidDate(value)) return undefined
        return value ? new Date(value) : undefined
    }
}