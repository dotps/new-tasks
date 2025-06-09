type PrismaErrorMessage = {
    message: string
    responseCode: number
}

export class PrismaErrorHelper {
    private static readonly errors = new Map<string, PrismaErrorMessage>([
        ["P2000", { message: "The provided value for the column is too long for the column type", responseCode: 400 }],
        ["P2001", { message: "The record searched for in the where condition does not exist", responseCode: 404 }],
        ["P2002", { message: "Unique constraint failed", responseCode: 409 }],
        ["P2003", { message: "Foreign key constraint failed", responseCode: 409 }],
        ["P2004", { message: "A constraint failed on the database", responseCode: 400 }],
        ["P2005", { message: "The value stored in the database for the field is invalid for the field type", responseCode: 400 }],
        ["P2006", { message: "The provided value for the field is not valid", responseCode: 400 }],
        ["P2007", { message: "Data validation error", responseCode: 400 }],
        ["P2008", { message: "Failed to parse the query", responseCode: 400 }],
        ["P2009", { message: "Failed to validate the query", responseCode: 400 }],
        ["P2010", { message: "Raw query failed", responseCode: 500 }],
        ["P2011", { message: "Null constraint violation", responseCode: 400 }],
        ["P2012", { message: "Missing a required value", responseCode: 400 }],
        ["P2013", { message: "Missing a required argument", responseCode: 400 }],
        ["P2014", { message: "The change you are trying to make would violate the required relation", responseCode: 400 }],
        ["P2015", { message: "A related record could not be found", responseCode: 404 }],
        ["P2016", { message: "Query interpretation error", responseCode: 400 }],
        ["P2017", { message: "The records for relation between the parent and child models are not connected", responseCode: 400 }],
        ["P2018", { message: "The required connected records were not found", responseCode: 404 }],
        ["P2019", { message: "Input error", responseCode: 400 }],
        ["P2020", { message: "Value out of range for the type", responseCode: 400 }],
        ["P2021", { message: "The table does not exist in the current database", responseCode: 404 }],
        ["P2022", { message: "The column does not exist in the current database", responseCode: 404 }],
        ["P2023", { message: "Inconsistent column data", responseCode: 400 }],
        ["P2024", { message: "Timed out fetching a new connection from the pool", responseCode: 500 }],
        ["P2025", { message: "An operation failed because it depends on one or more records that were required but not found", responseCode: 404,}],
        ["P2026", { message: "The current database provider doesn't support a feature that the query used", responseCode: 400 }],
        ["P2027", { message: "Multiple errors occurred on the database during query execution", responseCode: 500 }],
    ])

    static getErrorMessage(errorCode: string): PrismaErrorMessage | null {
        const findError = this.errors.get(errorCode)
        if (!findError) {
            return {
                message: "Unknown error.",
                responseCode: 500,
            }
        }
        return {
            message: findError.message,
            responseCode: findError.responseCode,
        }
    }
}