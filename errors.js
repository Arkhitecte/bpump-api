class LoginFileError extends Error {
    name = "UsernameLookupError"
    message = "Ce nom d'utilisateur n'apparaît pas dans la base de données"
}
