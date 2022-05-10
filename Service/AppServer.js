const fs = require('fs');
const express = require('express');
const database = require('../Data/database/db_connection');
const recommender = require('./recommenderApi');
const { PythonShell } = require('python-shell');

const conn = JSON.parse(fs.readFileSync('connections.json'));

let python = new PythonShell('../Data/recommender/recommender.py');
python.on('message', (message) => {
	console.log('Recommender: ' + message);
});

const app = express();
  
app.use(
	express.urlencoded({
		extended: false
	})
);

app.get('/', (req, res) => {
	let msg = 'AppServer is listening';
	res.send(msg);
	console.log(msg);
});

// Example: http://localhost:8080/getEvent?event_id=62659000cf3b790c6cf9f96b
app.get('/getEvent', (req, res) => {
	let eid = req.query.event_id;
	database.getEventById(eid).then((event) => res.send(event));
});

app.get('/searchEvent', (req, res) => {
	let keyword = req.query.keyword;
	database.searchEvent(keyword).then((eventList) => res.send(eventList));
})

// Example: postman
app.post('/createEvent', (req, res) => {
    newEvent = {
        title: req.body.title,
        creationTime: Date(),
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		recurrent: req.body.recurrent,
		location: req.body.location,
		description: req.body.description,
		interests: req.body.interests,
		preconditions: req.body.preconditions,
		initiator: req.body.initiator,
		managers: req.body.managers,
		participants: req.body.participants,
		image: req.body.image,
		qr_code: req.body.qr_code,
		tags: req.body.tags,
		status: req.body.status
    };
    let result = database.createNewEvent(newEvent);
	res.send(result)
});

app.get('/getGroup', (req, res) => {
	let eid = req.query.event_id;
	database.getEventById(eid).then((event) => res.send(event));
});

// Example: http://localhost:8080/getPredictionCF?user_id=123464&k=10&userbased=1
app.get('/getPredictionCF', (req, res) => {
	let uid = req.query.user_id;
	let k = req.query.k;
	let userbased = req.query.userbased;
	recommender.predict_cf(uid, k, userbased).then((topk) => res.send(topk));
});

// Example: http://localhost:8080/TEST1?user_id=123464&train=../Data/recommender/datasets/train.json
app.get('/TEST1', (req, res) => {
	let uid = req.query.user_id;
	let train = req.query.train;
	recommender.train_nn(uid, train).then((topk) => res.send(topk));
});
// Example: http://localhost:8080/TEST2?user_id=123464&test=../Data/recommender/datasets/test.json
app.get('/TEST2', (req, res) => {
	let uid = req.query.user_id;
	let test = req.query.test;
	recommender.predict_nn(uid, test).then((topk) => res.send(topk));
});

app.listen(conn.App.port, () => console.log('AppServer is up!'));

// process.on('SIGTERM', shutDown);
// process.on('SIGINT', shutDown);

// function shutDown() {
// 	dbClient.close();
// 	// recommender close?
// }
