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
                case 1 : res.status(403).send("Wrong Password")
                case 2 : res.status(404).send("User not found")
                case 3 : res.status(500).send("Internal Servor Error")
                case 0 : break
                default : res.status(500).send("Internal Server Error")
            }
            user = result
            res.send(user.data)
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});