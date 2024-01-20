const { json } = require("body-parser")
const fs = require("fs-extra")
const path = require("path")

function loginFetch(username, password) {
    const userPath = path.join(__dirname, "users", `${username}.json`)
    return new Promise((resolve, reject) => {
        if (!userPath.startsWith(path.join(__dirname, "users"))) {
            reject("User not found")
            return { success: 2 }
        }
        fs.readFile(userPath, "utf8", (err, data) => {
            if (err) {
                reject("Not found")
                return { success: 2 }
            } else {
                resolve(loginCheck(JSON.parse(data), password))
            }
        })
    })
}

function loginCheck(original, input) {
    if (original.password !== input) {
        return { success: 1 }
    }
    return {
        success: 0,
        username: original.username,
        permissions: original.permissions,
        data: original.data,
    }
}

//loginFetch('admfin', '1234')
function authAgent(username, password) {
    return loginFetch(username, password)
        .then((result) => {
            return result
        })
        .catch((error) => {
            console.error(error)
            return { success: 3 }
        })
}

module.exports.authAgent = authAgent
