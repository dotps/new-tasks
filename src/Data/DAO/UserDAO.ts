import {UserData, UserModelDelegate} from "../Types"
import {IUserDAO} from "./IUserDAO"
import {CrudDAO} from "./CrudDAO"

export class UserDAO extends CrudDAO<UserData, UserModelDelegate> implements IUserDAO {
    constructor(model: UserModelDelegate) {
        super(model)
    }
}

