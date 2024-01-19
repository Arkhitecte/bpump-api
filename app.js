const express = require("express")
const morgan = require("morgan")
const app = express()
const fs = require("fs-extra")
const path = require("path")

const { fetchFiles } = require("./fetchFiles")
const { authAgent } = require("./login.js")

app.use(express.json())
app.use(morgan("dev"))
app.use("exercices", express.static("exercices"))

const PORT = 3000
app.listen(PORT, () => {
    console.log("Serveur ouvert sur le port :", PORT)
})

app.get("/exos/:exercice", (req, res) => {
    try {
        const exercicePath = path.join(
            __dirname,
            "exercices",
            `${req.params.exercice}.json`,
        )
        // Check if the requested path is within the exercices directory
        if (!exercicePath.startsWith(path.join(__dirname, "exercices"))) {
            return res.status(403).send("Interdit")
        }

        fs.readFile(exercicePath, "utf8", function (err, data) {
            if (err) {
                res.status(404).send("Non trouvé")
            } else {
                res.send(data)
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Erreur interne du serveur")
    }
})
console.log(fetchFiles("./exercices"))

app.post("/logintest", (req, res) => {
    try {
        if (!req.query) {
            res.status(400).send("Arguments manquants")
            return
        }
        if (!req.query.username) {
            res.status(400).send("Nom d'utilisateur manquant")
            return
        }
        if (!req.query.password) {
            res.status(400).send("Mot de passe manquant")
            return
        }
        authAgent(req.query.username, req.query.password).then((result) => {
            switch (result.success) {
                case 1:
                    res.status(403).send("Mot de passe incorrect")
                case 2:
                    res.status(404).send("Utilisateur non trouvé")
                case 3:
                    res.status(500).send("Erreur interne du serveur")
                case 0:
                    break
                default:
                    res.status(500).send("Erreur interne du serveur")
            }
            user = result
            res.send(user.data)
        })
    } catch (error) {
        console.error(error)
        res.status(500).send("Erreur interne du serveur")
    }
})
