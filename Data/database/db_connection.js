const fs = require('fs');
const conn = JSON.parse(fs.readFileSync('connections.json'));
const User = require('./User.js');
const Interest = require('./Interest.js');
const Tag = require('./Tag.js');
const Event = require('./Event.js');
const Group = require('./Group.js');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const { constants } = require('buffer');
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
module.exports.createUser = async function(newUser) {
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
module.exports.searchActivity = async function(keyword) {
	console.log(`searchActivity, Keyword to search is ${keyword}`);
	const result = await users.find({ firstName: "Shir" }).toArray();
	console.log(`firstName is ${(result[0].firstName)}\n`)
	console.log(`lastName is ${(result[0].lastName)}\n`)
	console.log(`result is ${(JSON.stringify(result[0]))}\n`)
	const found = users.find({$or:[{firstName: "shir", lastName: "Shir"}]})
	return result[0]
};

//creat NewEvent
module.exports.createNewActivity = async function(newActivity) {
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
module.exports.getActivityById = async function(eventId) {
	const result = await activities.find({ _id: ObjectId(eventId) }).toArray();
	return result[0];
};
