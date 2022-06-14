const fs = require('fs');
const conn = JSON.parse(fs.readFileSync('connections.json'));
const User = require('./User.js');
const Interest = require('./Interest.js');
const Tag = require('./Tag.js');
const Event = require('./Event.js');
const Group = require('./Group.js');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const { error } = require('console');
const hash = crypto.createHash('sha512');

const client = new MongoClient(conn.Database.uri);
client.connect();

const database = client.db('activitygram');
const activities = database.collection('activities');
const users = database.collection('users');
const groups = database.collection('groups');
const interests = database.collection('interests');
const tags = database.collection('tags');
const models = database.collection('models');
const ratings = database.collection('ratings');

const interestsPath = '../Data/recommender/datasets/interests.csv';
const ratingsPath = '../Data/recommender/datasets/ratings.csv';
const datasetsPath = '../Data/recommender/datasets/train_uid_';

// Fetch Collaborative Filtering data
module.exports.fetchDataForCF = async () => {
    let interestsContent = 'interestId,title,tags\n';
    let interestsDocs = await interests.find().toArray();
    interestsDocs.forEach((d) => {
        interestsContent += `${d._id.toString()},${d.title},`;
        d.tags.forEach((t) => (interestsContent += `${t}|`));
        interestsContent = interestsContent.slice(0, -1);
        interestsContent += '\n';
    });
    fs.writeFileSync(interestsPath, interestsContent.slice(0, -1));

    let ratingsContent = 'userId,interestId,rating\n';
    let ratingsDocs = await ratings.find().toArray();
    ratingsDocs.forEach((d) => {
        ratingsContent += `${d.userId},${d.interestId},${d.rating}\n`;
    });
    fs.writeFileSync(ratingsPath, ratingsContent.slice(0, -1));

    return ratingsDocs.length;
};

// Fetch Neural Network data
module.exports.fetchDataForNN = async (user_id) => {
    let train = [];
    let user = await users.find({ _id: ObjectId(user_id) }).toArray();
    let activityLog = user[0].activityLog;
    for (const log of activityLog) {
        let jsoned = JSON.parse(log);
        let aid = jsoned.activity_id;
        let activity = await activities.find({ _id: ObjectId(aid) }).toArray();
        let description = activity[0].description;
        let label = jsoned.label;
        train.push({
            activity_id: aid,
            description: description,
            label: label
        });
    }
    fs.writeFileSync(`${datasetsPath}${user_id}.json`, JSON.stringify(train, null, 2));
    return train.length
};

// Create a user
module.exports.createUser = async function (newUser) {
    const user = await users.insertOne(newUser);
    const uido = await user.insertedId
    const uid = uido.toString();
    const hashedSaltedPassword = hash.update(newUser.password + uid, 'utf-8').digest('hex');
    await users.updateOne({ _id: uido }, { $set: { hashedPassword: hashedSaltedPassword } });
    await JSON.parse(newUser.interests).forEach((interest) => {
        ratings.insertOne({
            userId: uid,
            interestId: interest.id,
            rating: 10.0
        });
    });
    return `New user created with the id: ${uid}`;
};

//get User by ID
module.exports.getUserById = async function (userId) {
    const result = await users.find({ _id: ObjectId(userId) }).toArray();
    return result[0];
};

module.exports.getUserByFirebaseId = async function (firebaseId) {
    const result = await users.find({ firebaseId: firebaseId }).toArray();
    return result[0];
};

//Update functions
async function changeUserFirstName(curr_user, firstName) {
    const result = await users.updateOne({ _id: curr_user.id }, { $set: { firstName: firstName } });
}

async function changeUserLastName(curr_user, lastName) {
    const result = await users.updateOne({ _id: curr_user.id }, { $set: { lastName: lastName } });
}

async function changeUserDateOfBirth(curr_user, dateOfBirth) {
    const result = await users.updateOne({ _id: curr_user.id }, { $set: { dateOfBirth: dateOfBirth } });
}

async function changeUserAge(curr_user, age) {
    const result = await users.updateOne({ _id: curr_user.id }, { $set: { age: age } });
}

async function changeUserCountry(curr_user, country) {
    const result = await users.updateOne({ _id: curr_user.id }, { $set: { country: country } });
}

async function changeUserProfileImage(curr_user, profileImage) {
    const result = await users.updateOne({ _id: curr_user.id }, { $set: { profileImage: profileImage } });
}

async function changeUserBio(curr_user, bio) {
    const result = await users.updateOne({ _id: curr_user.id }, { $set: { bio: bio } });
}

async function changeUserFriendsList(curr_user, friendsList) {
    const result = await users.updateOne({ _id: curr_user.id }, { $set: { friendsList: friendsList } });
}

async function changeUserIntrests(curr_user, intrests) {
    const result = await users.updateOne({ _id: curr_user.id }, { $set: { intrests: intrests } });
}

async function changeUserActivityLog(curr_user, activityLog) {
    const result = await users.updateOne({ _id: curr_user.id }, { $set: { activityLog: activityLog } });
}

module.exports.updateActivityParticipants = async function (activityId, participantsArr) {
    await activities.updateOne({ _id: ObjectId(activityId) }, { $set: { participants: participantsArr } });
}

// print databases
async function listDatabases() {
    databasesList = await database.admin().listDatabases();
    console.log('Databases:');
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

//creat NewInterest
async function createNewInterest(newInterest) {
    const result = await client.db('activitygram').collection('interests').insertOne(newInterest.forDB);
    newInterest.set_id = result.insertedId;
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

//creat NewTag
async function createNewTag(client, newTag) {
    const result = await client.db('activitygram').collection('tags').insertOne(newTag.forDB);
    newTag.set_id = result.insertedId;
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

// search events
module.exports.searchActivity = async function (keyword, userState, activitiesState, groupsState) {
    console.log(`\nin searchActivity = async function(keyword, userState, activitiesState, groupsState)`)
    let usersFound = []
    let activitiesFound = []
    let groupsFound = []

    // searching in database...
    if (userState == "true") {
        // const wheretoSearch = [firstName, lastName, bio, city, state, school, interests, activityLog]
        console.log(`userState is true`)
        const options = {
            $or: [
                { firstName: keyword },
                { lastName: keyword },
                { bio: keyword },
                { city: keyword },
                { state: keyword },
                { school: keyword },
                { interests: keyword },
                { country: keyword }
            ]
        }
        usersFound = await users.find(options).toArray()
        console.log(`found ${usersFound.length} users`)
        console.log(`usersFound = ${JSON.stringify(usersFound)}`)
    }
    if (activitiesState == "true") {
        console.log(`activitiesState is true`)
        const options = {
            $or: [
                { description: keyword },
                { conditions: keyword },
                { group_managers: keyword },
                { participants: keyword },
                { tags: keyword },
                { title: keyword }
            ]
        }
        activitiesFound = await activities.find(options).toArray()
        console.log(`found ${activitiesFound.length} activities`)
        console.log(`activitiesFound = ${JSON.stringify(activitiesFound)}`)
    }
    if (groupsState == "true") {
        console.log(`activitiesState is true`)
        const options = {
            $or: [
                { description: keyword },
                { conditions: keyword },
                { group_managers: keyword },
                { participants: keyword },
                { tags: keyword },
                { title: keyword }
            ]
        }
        groupsFound = await groups.find(options).toArray()
        console.log(`found ${groupsFound.length} groups`)
        console.log(`groupsFound = ${JSON.stringify(groupsFound)}`)
    }

    // get all found data together and return it
    console.log(`end of searchActivity\n`)
    const allFoundObjects = []
    allFoundObjects.push(usersFound)
    allFoundObjects.push(activitiesFound)
    allFoundObjects.push(groupsFound)
    return allFoundObjects
};

//creat NewEvent
module.exports.createNewActivity = async function (newActivity) {
    const result = activities.insertOne(newActivity);
    return `New listing created with the following id: ${result.insertedId}`;
};

//creat NewGroup
async function createNewGroup(client, newGroup) {
    const result = await client.db('activitygram').collection('groups').insertOne(newGroup.forDB);
    newGroup.set_id = result.insertedId;
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

//get Activity by ID
module.exports.getActivityById = async function (activityId) {
    const result = await activities.find({ _id: ObjectId(activityId) }).toArray();
    return result[0];
};

//get All activities
module.exports.getAllActivities = async function () {
    const result = await activities.find().toArray();
    return result;
};

// Get All Interests
module.exports.getAllInterests = async function () {
    const result = await interests.find().toArray();
    array = []
    for (const item of result) {
        if (item.title) {
            array.push({
                id: item._id.toString(),
                title: item.title
            })
        }
    }
    return array;
};

// Get all users
module.exports.getAllUsers = async function () {
    const result = await users.find().toArray();
    let array = []
    for (const item of result) {
        if (item.firstName && item.lastName && item.bio) {
            array.push({
                id: item._id.toString(),
                title: item.firstName + ' ' + item.lastName + ' | ' + item.bio
            })
        }
    }
    return array;
};