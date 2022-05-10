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
const models = database.collection('models')
const datasets = database.collection('datasets')


//creat newUser
async function createNewUser(client, newUser) {
	const result = await users.insertOne(newUser.forDB);
	newUser.set_id = result.insertedId;
	console.log(`New listing created with the following id: ${result.insertedId}`);
}

//Update functions
async function changeFirstName(curr_user, firstName) {
	const result = await users.updateOne({ _id: curr_user.id }, { $set: { firstName: firstName } });
}

async function changeLastName(curr_user, lastName) {
	const result = await users.updateOne({ _id: curr_user.id }, { $set: { lastName: lastName } });
}

async function changeDateOfBirth(curr_user, dateOfBirth) {
	const result = await users.updateOne({ _id: curr_user.id }, { $set: { dateOfBirth: dateOfBirth } });
}

async function changeAge(curr_user, age) {
	const result = await users.updateOne({ _id: curr_user.id }, { $set: { age: age } });
}

async function changeCountry(curr_user, country) {
	const result = await users.updateOne({ _id: curr_user.id }, { $set: { country: country } });
}

async function changeProfileImage(curr_user, profileImage) {
	const result = await users.updateOne({ _id: curr_user.id }, { $set: { profileImage: profileImage } });
}

async function changeBio(curr_user, bio) {
	const result = await users.updateOne({ _id: curr_user.id }, { $set: { bio: bio } });
}

async function changeFriendsList(curr_user, friendsList) {
	const result = await users.updateOne({ _id: curr_user.id }, { $set: { friendsList: friendsList } });
}

async function changeIntrests(curr_user, intrests) {
	const result = await users.updateOne({ _id: curr_user.id }, { $set: { intrests: intrests } });
}

async function changeActivityLog(curr_user, activityLog) {
	const result = await users.updateOne({ _id: curr_user.id }, { $set: { activityLog: activityLog } });
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
module.exports.getEventById = async function(eventId) {
	const result = await events.find({ _id: ObjectId(eventId) }).toArray();
	return result[0];
}
