const fs = require('fs')
const conn = JSON.parse(fs.readFileSync('connections.json'));
const User = require('./User.js');
const Interest = require('./Interest.js');
const Tag = require('./Tag.js');
const Event = require('./Event.js');
const Group = require('./Group.js');
const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient(conn.Database.uri);
client.connect()

const database = client.db('activitygram');
const events = database.collection('events');
const users = database.collection('users');
const groups = database.collection('groups');
const interests = database.collection('interests');
const tags = database.collection('tags');

// models = database.collection('models')
// datasets = database.collection('datasets')


//creat newUser
async function createNewUser(client, newUser) {
	const result = await client.db('activitygram').collection('users').insertOne(newUser.forDB);
	newUser.set_id = result.insertedId;
	console.log(`New listing created with the following id: ${result.insertedId}`);
}

//Update functions
async function changeFirstName(client, curr_user, firstName) {
	const result = await client
		.db('activitygram')
		.collection('users')
		.updateOne({ _id: curr_user.id }, { $set: { firstName: firstName } });
}

async function changeLastName(client, curr_user, lastName) {
	const result = await client
		.db('activitygram')
		.collection('users')
		.updateOne({ _id: curr_user.id }, { $set: { lastName: lastName } });
}

async function changeDateOfBirth(client, curr_user, dateOfBirth) {
	const result = await client
		.db('activitygram')
		.collection('users')
		.updateOne({ _id: curr_user.id }, { $set: { dateOfBirth: dateOfBirth } });
}

async function changeAge(client, curr_user, age) {
	const result = await client
		.db('activitygram')
		.collection('users')
		.updateOne({ _id: curr_user.id }, { $set: { age: age } });
}

async function changeCountry(client, curr_user, country) {
	const result = await client
		.db('activitygram')
		.collection('users')
		.updateOne({ _id: curr_user.id }, { $set: { country: country } });
}

async function changeProfileImage(client, curr_user, profileImage) {
	const result = await client
		.db('activitygram')
		.collection('users')
		.updateOne({ _id: curr_user.id }, { $set: { profileImage: profileImage } });
}

async function changeBio(client, curr_user, bio) {
	const result = await client
		.db('activitygram')
		.collection('users')
		.updateOne({ _id: curr_user.id }, { $set: { bio: bio } });
}

async function changeFriendsList(client, curr_user, friendsList) {
	const result = await client
		.db('activitygram')
		.collection('users')
		.updateOne({ _id: curr_user.id }, { $set: { friendsList: friendsList } });
}

async function changeIntrests(client, curr_user, intrests) {
	const result = await client
		.db('activitygram')
		.collection('users')
		.updateOne({ _id: curr_user.id }, { $set: { intrests: intrests } });
}

async function changeActivityLog(client, curr_user, activityLog) {
	const result = await client
		.db('activitygram')
		.collection('users')
		.updateOne({ _id: curr_user.id }, { $set: { activityLog: activityLog } });
}

// print databases
async function listDatabases(client) {
	databasesList = await client.db().admin().listDatabases();
	console.log('Databases:');
	databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

//creat NewInterest
async function createNewInterest(client, newInterest) {
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
module.exports.searchEvent = async function (keyword) {
    events.createIndex({ title: 'text', description: 'text' });
	query = { $text: { $search: keyword } };
	const eventList = await events.find(query).toArray();
	return eventList;
};

//creat NewEvent
module.exports.createNewEvent = async function(newEvent) {
	const result = events.insertOne(newEvent);
	return `New listing created with the following id: ${result.insertedId}`;
};

//creat NewGroup
async function createNewGroup(client, newGroup) {
	const result = await client.db('activitygram').collection('groups').insertOne(newGroup.forDB);
	newGroup.set_id = result.insertedId;
	console.log(`New listing created with the following id: ${result.insertedId}`);
}

//get Event by ID
async function getEventById(eventId) {
	const result = await events.find({ _id: ObjectId(eventId) }).toArray();
	return result[0];
}

// async function connectToDB(uri) {
//   try {
//     // Connect to the MongoDB cluster
//     await client.connect();
//     // new_user = new User("Shlomi")
//     // Create a single new listing
//     // await createNewUser(client, new_user);
//     // await changeUserName(client, new_user, "SHLOMI");
//     // new_interest = new Interest("Swimming")
//     // await createNewInterest(client, new_interest);
//     // new_tag = new Tag("Ball")
//     // await createNewTag(client, new_tag);
//     // new_Event = new Event("Mimuna calebration")
//     //await createNewEvent(client, new_Event);
//     // new_Group = new Group("Dancers")
//     //await createNewGroup(client, new_Group);
//     // await getEventById(client, "62659000cf3b790c6cf9f96b");
//   } catch (e) {
//     console.error(e);
//   }
// }
// module.exports.connectToDB = connectToDB;

module.exports.getEventById = getEventById;
