const fs = require('fs');
const express = require('express');
const PythonShell = require('python-shell').PythonShell;

let conn = JSON.parse(fs.readFileSync('connections.json'));

let python = new PythonShell('../Data/recommender/recommender.py')
python.on('message', (message) => {
    console.log('Recommender: ' + message);
});

const app = express();

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.get('/', (req, res) => {
    res.send('AppServer pong');
    console.log("AppServer pong");
});

app.get('/getEvent', (req, res) => {
    console.log('getEvent recieved')
    // let p1 = req.params.param1
    // let p2 = req.params.param2
    // let event = db.someGetFunc(p1, p2);
    // res.send(event);
});

app.post('/setEvent', (req, res) => {
    console.log('setEvent recieved')
    // let p1 = req.body.param1
    // let p2 = req.body.param2
    // db.someSetFunc(p1, p2);
});

app.listen(conn.App.port, () => console.log('AppServer is up!'));
