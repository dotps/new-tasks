import {CrudDAO} from "./crud.dao"
import {UserData, UserModelDelegate} from "../types"
import {IUserDAO} from "./user.dao.interface"

export class UserDAO extends CrudDAO<UserData, UserModelDelegate> implements IUserDAO {
    constructor(model: UserModelDelegate) {
        super(model)
    }
}

