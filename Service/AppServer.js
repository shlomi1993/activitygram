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

/** USERS */

app.post('/createUser', (req, res) => {
    newUser = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        bio: req.body.bio,
        city: req.body.city,
        state: req.body.state,
		phone: req.body.phone,
        email: req.body.email,
        facebook: req.body.facebook,
        twitter: req.body.twitter,
        linkedin: req.body.linkedin,
        github: req.body.github,        
		lastGeo: req.body.lastGeo,
        school: req.body.school,
        collage: req.body.collage,
		interests: req.body.interests,
		image: req.body.image,
		activityLog: [],
		initiatedActivities: [],
        managedActivities: [],
		participantedActivities: [],
        suspension: false,
        creationTime: Date(),
    };
    let result1 = database.createUser(newUser);
    let result2 = database.updateRatings(req.body.initial_ratings);  // ratings should be a string of "userId, interestId, tag1|tag2|...|tagn"
	res.send(result1)
});



/** ACTIVITIES */

app.get('/getEvent', (req, res) => {
	let eid = req.query.event_id;
	database.getEventById(eid).then((event) => res.send(event));
});

app.get('/searchEvent', (req, res) => {
	let keyword = req.query.keyword;
	database.searchEvent(keyword).then((eventList) => res.send(eventList));
})

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

app.get('/getPredictionCF', (req, res) => {
	let uid = req.query.user_id;
	let k = req.query.k;
	let userbased = req.query.userbased;
	recommender.predict_cf(uid, k, userbased).then((topk) => res.send(topk));
});

app.get('/getPredictionNN', (req, res) => {
	let uid = req.query.user_id;
	let test = req.query.test;
	recommender.predict_nn(uid, test).then((topk) => res.send(topk));
});


app.listen(conn.App.port, () => console.log('AppServer is up!'));
