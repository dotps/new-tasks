export interface IEntityValidator {
    isValidCreateData(): boolean
    isValidUpdateData(): boolean
}