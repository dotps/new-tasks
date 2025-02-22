import {UserData, UserModelDelegate} from "../Data/Types"
import {IUserDAO} from "./IUserDAO"
import {CrudDAO} from "./CrudDAO"

export class UserDAO extends CrudDAO<UserData, UserModelDelegate> implements IUserDAO {
    constructor(model: UserModelDelegate) {
        super(model)
    }
}

