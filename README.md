Зарегистрироваться и получить токен `POST` `/api/users`
```json
{
  "name": "Test",
  "email": "test@test.ru"
}
```
Токен 
```
"accessToken": "YWNjZXNzLXRva2VuITEyITE3NzgzNzg4MTU5MTk=",
"refreshToken": "cmVmcmVzaC10b2tlbiExMiExNzc4Mzc4ODE1OTE5"
```
Создание задачи `POST` `/api/tasks`
```json
{
    "title": "Test1",
    "description": "123",
    "dueAt": "2025-10-15T02:13:21",
    "projectId": 1
}
```
Обновление задачи `PUT` `/api/tasks/:taskId`

Обновление всегда возвращает статус 200, обновляет только то, что передано. Не информирует какие поля были обновлены, игнорирует поля которые не описаны в сущности. 
```json
{
    "title": "Test1",
    "description": "123",
    "dueAt": "2025-10-15T02:13:21",
    "projectId": 1
}
```
