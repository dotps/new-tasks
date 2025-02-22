import {TaskData} from "../Data/Types";

export class TaskHelper {
    static calculateWorkingTime(tasks: Partial<TaskData>[]): number {
        let seconds = 0
        for (const task of tasks) {
            if (task.createdAt && task.completedAt) {
                const elapsedSeconds = (task.completedAt.getTime() - task.createdAt.getTime()) / 1000
                seconds += elapsedSeconds
            }
        }
        return seconds
    }
}