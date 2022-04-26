const fs = require('fs');
const express = require('express');
const db = require('../Data/database/db_connection');
const { exit } = require('process');
const spawn = require("child_process").spawn;

var conn = JSON.parse(fs.readFileSync('connections.json'));

const recommender = spawn('python3',["./Data/recommender/recommender.py", conn.Recommender.ip, conn.Recommender.port]);
const app = express();

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.get('/ping', (req, res) => {
    res.send('pong');
    console.log("pong");
});

app.get('/getEvent', (req, res) => {
    let p1 = req.params.param1
    let p2 = req.params.param2
    let event = db.someGetFunc(p1, p2);
    res.send(event);
});

app.post('/setEvent', (req, res) => {
    let p1 = req.body.param1
    let p2 = req.body.param2
    db.someSetFunc(p1, p2);
});

app.listen(conn.App.port, () => console.log('AppServer is up!'));