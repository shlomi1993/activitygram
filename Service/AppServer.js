const fs = require('fs');
const conn = JSON.parse(fs.readFileSync('connections.json'));

const multer = require('multer');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const database = require('../Data/database/db_connection');
const recommender = require('./recommenderApi');
const geocoder = require('./geocodeApi');

const { PythonShell } = require('python-shell');
const recommenderService = new PythonShell('../Data/recommender/recommender.py');
const geocoderService = new PythonShell('../Data/geocoder/geocoder.py');

let allActivities;

var ratingsSize = 0;
var userActivityLogSizes = {};

async function refreshPredMatrix() {
    if (ratingsSize * 1.05 < database.getCurrentRatingSize()) {
        ratingsSize = database.fetchDataForCF();
        recommender.train_cf(database.interestsPath, database.ratingsPath);
        console.log('Prediction matrix refreshed.');
    } else {
        console.log('Prediction matrix is sufficiently updated.');
    }
}

async function refreshUserModel(uid, currentUserModelSize) {
    if (!userActivityLogSizes[uid] || userActivityLogSizes[uid] * 1.05 < currentUserModelSize) {
        database.fetchDataForNN(uid);
        userActivityLogSizes[uid] = currentUserModelSize;
        console.log(`Model of uid ${uid} refreshed.`);
    } else {
        console.log(`Model of uid ${uid} is sufficiently updated.`);
    }
}

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './images');
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

app.get('/', (req, res) => {
    let msg = 'AppServer is listening.';
    res.status(200).send(msg);
    console.log(msg);
});

app.get('/geocode', (req, res) => {
    geocoder.geocode(req.query.address)
        .then((result) => {
            res.status(200).send(result);
            console.log('geocode request succeeded.');
        })
        .catch((error) => {
            let msg = 'geocode request failed.';
            res.status(500).send(msg);
            console.error(msg);
        });
});

app.get('/geocodeReverse', (req, res) => {
    geocoder.reverse(req.query.latitude, req.query.longitude)
        .then((result) => {
            res.status(200).send(result);
            console.log('geocodeReverse request succeeded.');
        })
        .catch((error) => {
            let msg = 'geocodeReverse request failed.';
            res.status(500).send(msg);
            console.error(msg);
        });
});

app.post('/imageUpload', upload.array('photo', 3), (req, res) => {
    res.status(200).json({
        message: 'success!',
    });
});

app.post('/templatePost', (req, res) => {
    console.log('NOT YET IMPLEMENTED.');
});

/** USERS */

app.get('/allUsers', (req, res) => {
    database.getAllUsers()
        .then((result) => {
            res.status(200).send(result);
            console.log('allUsers request succeeded.');
        })
        .catch((error) => {
            let msg = 'allUsers request failed.';
            res.status(500).send(msg);
            console.error(msg);
        });
});


app.get('/getUser', (req, res) => {
    database.getUserById(req.query.user_id).then((user) => res.send(user));
});

app.get('/getUserByEmail', (req, res) => {
    database.getUserByEmail(req.query.user_email).then((user) => res.send(user));
});

app.post('/createUser', (req, res) => {
    newUser = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        images: req.body.images, // first image is the profile picture
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
        interests: req.body.interests, // for CF, contains objects of {"interestId": interestId, "rating:" rate}
        activityLog: [], // for NN, contains objects of {"activity": eventObj, "label": label}
        initiatedActivities: [],
        managedActivities: [],
        participantedActivities: [],
        suspension: false,
        creationTime: Date()
    };
    database.createUser(newUser)
        .then((result) => {
            res.status(200).send(result);
            console.log('createUser request succeeded.');
            database.fetchDataForCF();
        })
        .catch((error) => {
            let msg = 'createUser request failed.';
            res.status(500).send(msg);
            console.error(msg);
        });
});

/** ACTIVITIES */

app.post('/createActivity', (req, res) => {
    newActivity = {}
    for (const key in req.body) {
        newActivity[key] = req.body[key]
    }
    newActivity['creationTime'] = Date();
    database.createNewActivity(newActivity)
        .then((result) => {
            res.status(200).send(result);
            console.log('createActivity request succeeded.');
        })
        .catch((error) => {
            let msg = 'createActivity request failed.';
            res.status(500).send(msg);
            console.error(msg);
        });
});

app.post('/updateActivityParticipants', (req, res) => {
    const participants = JSON.parse(decodeURIComponent(req.query.participants))
    database.updateActivityParticipants(req.query.activity_id, participants)
        .then((result) => {
            res.status(200).send(result);
            console.log('updateActivityParticipants request succeeded.');
        })
        .catch((error) => {
            let msg = 'updateActivityParticipants request failed. Status: ' + error.response.statusText;
            res.status(error.response.status).send(msg);
            console.error(msg);
        });
});

app.get('/getActivity', (req, res) => {
    database.getActivityById(req.query.activity_id).then((event) => res.send(event));
});

app.post('/search', (req, res) => {
    console.log(`\nin app.post('/search', (req, res)`)
    console.log(`req.body ${JSON.stringify(req.body)}`);
    const name_to_search = req.body.title
    const userState = req.body.searchUsers
    const activitiesState = req.body.searchActivities
    const groupState = req.body.searchGroups

    database.searchActivity(name_to_search, userState, activitiesState, groupState)
        .then((result) => {
            res.status(200).send(result);
            // console.log
            console.log('searchActivity request succeeded.');
        })
        .catch((error) => {
            let msg = 'searchActivity request failed.';
            res.status(500).send(msg);
            console.error(msg);
            console.error(error);
        });

    // let result = database.searchActivity(name_to_search, userState, activitiesState, groupState)
    // console.log(`result is ${result}`)
    // res.send(result);

});

/** GROUPS */

app.post('/createGroup', (req, res) => {
    newGroup = {
        title: req.body.title,
        description: req.body.description,
        commonInterests: req.body.commonInterests,
        preconditions: req.body.preconditions,
        initiator: req.body.initiator,
        managers: req.body.managers,
        participants: req.body.participants,
        images: req.body.images,
        qrCode: req.body.qrCode,
        activityHistory: [],
        creationTime: Date()
    };
    let result = database.createGroup(newGroup);
    res.send(result);
});

app.post('/editGroup', (req, res) => {
    console.log('NOT YET IMPLEMENTED.');
});

app.post('/addCommonInterest', (req, res) => {
    console.log('NOT YET IMPLEMENTED.');
});

app.post('/removeCommonInterest', (req, res) => {
    console.log('NOT YET IMPLEMENTED.');
});

app.post('/addGroupPrecondition', (req, res) => {
    console.log('NOT YET IMPLEMENTED.');
});
app.get('/searchActivity', (req, res) => {
    console.log('NOT YET IMPLEMENTED.');
    // let keyword = req.query.keyword;
    // database.searchActivity(keyword).then((eventList) => res.send(eventList));
});

app.get('/getAllActivities', (req, res) => {
    database.getAllActivities().then((activities) => {
        allActivities = activities 
        res.send(activities) 
    });
});

app.get('/getMyActivities', (req, res) => {
    console.log(req.query.user_id)
    if(allActivities) {
        const filtered =
        allActivities.filter((act) => { return act.participants && Array.isArray(act.participants) })
            .filter((act) => { return act.participants.find((p) => { return p === req.query.user_id }) });
        res.send(filtered)
    } else {
        database.getAllActivities().then((activities) => {
            const userId = req.query.user_id;
            const filtered =
                activities.filter((act) => { return act.participants && Array.isArray(act.participants) })
                    .filter((act) => { return act.participants.find((p) => { return p === req.query.user_id }) });
            res.send(filtered)
        });
    }
});

app.get('/getCreatedByUserActivities', (req, res) => {
    if(allActivities) {
        const filtered =
        allActivities.filter((act) => { return act.managers && Array.isArray(act.managers) })
            .filter((act) => { return act.managers.find((p) => { return p === req.query.user_id }) });
        res.send(filtered)
    } else {
        database.getAllActivities().then((activities) => {
            const filtered =
                activities.filter((act) => { return act.managers && Array.isArray(act.managers) })
                    .filter((act) => { return act.managers.find((p) => { return p === req.query.user_id }) });
            res.send(filtered)
        });       
    }

});

/** Interests */

app.get('/allInterests', (req, res) => {
    database.getAllInterests()
        .then((result) => {
            res.status(200).send(result);
            console.log('allInterests request succeeded.');
        })
        .catch((error) => {
            let msg = 'allInterests request failed.';
            res.status(500).send(msg);
            console.error(msg);
        });
});

/** GROUPS */

app.post('/createGroup', (req, res) => {
    newGroup = {
        title: req.body.title,
        description: req.body.description,
        commonInterests: req.body.commonInterests,
        preconditions: req.body.preconditions,
        initiator: req.body.initiator,
        managers: req.body.managers,
        participants: req.body.participants,
        images: req.body.images,
        qrCode: req.body.qrCode,
        activityHistory: [],
        creationTime: Date()
    };
    let result = database.createGroup(newGroup);
    res.send(result);
});

/** RECOMMENDATIONS */

app.get('/getInterestPrediction', (req, res) => {
    let uid = req.query.userId;
    let k = req.query.k;
    let userbased = req.query.userbased;
    recommender.predict_cf(uid, k, userbased)
        .then((result) => {
            res.status(200).send(result);
            console.log('getInterestPrediction request succeeded.');
        })
        .catch((error) => {
            let msg = 'getInterestPrediction request failed.';
            res.status(500).send(msg);
            console.error(msg);
        });
});

app.get('/getActivityPrediction', (req, res) => {
    let userId = req.query.userId;
    let interest = req.query.interest;
    database.getActivityByCategory(interest)
        .then((activities) => {
            test = []
            for (const a of activities) {
                let current = Date()
                if (Date.parse(a.startDateTime) > Date.parse(current)) {
                    let testObj = {
                        activity_id: a._id.toString(),
                        activity_name: a.title,
                        description: a.description
                    }
                    test.push(testObj)
                }
            }
            recommender.predict_nn(userId, test)
                .then((offers) => { res.send(offers) });
        });
});

app.get('/refreshPredMatrix', (req, res) => {
    database.fetchDataForCF(100000);
    recommender.train_cf(database.interestsPath, database.ratingsPath);
});

app.listen(conn.App.port, () => {
    console.log(`AppServer is available at: http://${conn.App.ip}:${conn.App.port}/`)
});
