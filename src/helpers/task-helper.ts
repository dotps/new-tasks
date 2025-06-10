import {TaskData} from "../data/types"

export class TaskHelper {
    static calculateWorkingTime(tasks: Partial<TaskData>[]): number {
        return tasks.reduce(this.sumTaskWorkingTime, START_FROM_SECOND)
    }

    static sumTaskWorkingTime(seconds: number, task: Partial<TaskData>): number {
        if (task.createdAt && task.completedAt) {
            const elapsedSeconds = (task.completedAt.getTime() - task.createdAt.getTime()) / MILLISECONDS_IN_SECOND
            return seconds + elapsedSeconds
        }
        return seconds
    }
}

const MILLISECONDS_IN_SECOND = 1000
const START_FROM_SECOND = 0