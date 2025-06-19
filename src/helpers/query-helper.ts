import {DateHelper} from "./date-helper"
import {Request} from "express"
import {WorkingTimeParams} from "../data/types"

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

    static parseWorkingTimeParams(req: Request): WorkingTimeParams {
        const userId = Number(req.params.userId) || undefined
        const projectIds = QueryHelper.parseNumberList(String(req.query?.projects))
        const projectId = Number(req.params.projectId) || undefined
        const startDate = QueryHelper.parseDate(String(req.query?.start_date))
        const endDate = QueryHelper.parseDate(String(req.query?.end_date))
        return { userId, projectIds, projectId, startDate, endDate }
    }
}