const express = require("express");
const morgan = require('morgan');
const app = express()
const fs = require('fs-extra');
const path = require('path');

const { fetchFiles } = require('./fetchFiles')
const { authAgent } = require('./login.js')



app.use(express.json());
app.use(morgan('dev'));
app.use("exercices", express.static('exercices'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get('/exos/:exercice', (req, res) => {
    try {
        const exercicePath = path.join(__dirname, 'exercices', `${req.params.exercice}.json`);
        // Check if the requested path is within the exercices directory
        if (!exercicePath.startsWith(path.join(__dirname, 'exercices'))) {
            return res.status(403).send("Forbidden");
        }

        fs.readFile(exercicePath, 'utf8', function (err, data) {
            if (err) {res.status(404).send("Not found.");} 
            else {res.send(data);}
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
console.log(fetchFiles("./exercices"))

app.post('/logintest', (req, res) => {
    try {
        if (!req.query) {res.status(400).send("Missing arguments"); return}
        if (!req.query.username) {res.status(400).send("Missing username"); return}
        if (!req.query.password) {res.status(400).send("Missing password"); return}
        authAgent(req.query.username, req.query.password).then(result => {
            switch (result.success){
                case 1 : {res.status(403).send("Wrong Password");return}
                case 2 : {res.status(404).send("User not found");return}
                case 3 : {res.status(500).send("Internal Servor Error");return}
                case 0 : break
                default : {res.status(500).send("Internal Server Error");return}
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/addExercice", (req, res) => {
    try {
        console.log(req.body)
        if (!req.body) {res.status(400).send("Missing arguments"); return}
        if (!req.body.username) {res.status(400).send("Missing username"); return}
        if (!req.body.password) {res.status(400).send("Missing password"); return}
        authAgent(req.body.username, req.body.password).then(result => {
            switch (result.success){
                case 1 : {res.status(403).send("Wrong Password");return;break;}
                case 2 : {res.status(404).send("User not found");return;break;}
                case 3 : {res.status(500).send("Internal Servor Error");return;break;}
                case 0 : break
                default : {res.status(500).send("Internal Server Error");return;break;}
            }
            if(!result.permissions.post) return
            let r = req.body // Let's shorten the object declaration a bit
            try {
                console.log(r.maxAngleRight,parseInt(r.maxAngleRight))
                let exercice = {
                    [r.name] : {
                        "sugar" : {
                            "title" : r.title,
                            "description" : r.description,
                            "category" : r.category,
                            "difficulty" : parseInt(r.difficulty),
                            "invertReward" : /^true$/i.test(r.invertReward) // From Regex with Love 
                        },
                        "cameraTargets" : {
                            "left": {
                                "angle" : r.angleLeft,
                                "minAngle" : parseInt(r.minAngleLeft),
                                "maxAngle" : parseInt(r.maxAngleLeft)
                            },
                            "right": {
                                "angle" : r.angleRight,
                                "minAngle" : parseInt(r.minAngleRight),
                                "maxAngle" : parseInt(r.maxAngleRight)
                            }
                        },
                        "projectorTargets" : [
                            { "x" : parseInt(r.xprojTarget1), "y" : parseInt(r.yprojTarget1)},
                            { "x" : parseInt(r.xprojTarget2), "y" : parseInt(r.yprojTarget2)},
                        ]
                    }
                }
                exercice = JSON.stringify(exercice, null, 4);
                fs.writeFile(path.join(__dirname, 'exercices', `${r.name}.json`), exercice, function(err) {
                    if(err) {
                        res.status(500).send(err);
                        return
                    }
                    res.status(200).send(exercice);
                    return
                });
                return
            } catch (err) {
                console.log(err)
                res.status(400).send(err);
                return
            }
            return
        })
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})