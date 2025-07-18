const fs = require("fs");
const conn = JSON.parse(fs.readFileSync("connections.json"));
const { MongoClient, ObjectId } = require("mongodb");

// Connect the a DB-client.
const client = new MongoClient(conn.Database.uri);
client.connect();

// Make shortcut accesses.
const database = client.db("activitygram");
const activities = database.collection("activities");
const users = database.collection("users");
const groups = database.collection("groups");
const interests = database.collection("interests");
const tags = database.collection("tags");
const models = database.collection("models");
const ratings = database.collection("ratings");

// Print databases.
async function listDatabases() {
  databasesList = await database.admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

// Get current number of documents in ratings collection..
module.exports.getCurrentRatingSize = () => ratings.countDocuments();

// Fetch Collaborative-Filtering data.
module.exports.fetchDataForCF = async () => {
  let interestsContent = "interestId,title,tags\n";
  let interestsDocs = await interests.find().toArray();
  interestsDocs.forEach((d) => {
    interestsContent += `${d._id.toString()},${d.title},`;
    d.tags.forEach((t) => (interestsContent += `${t}|`));
    interestsContent = interestsContent.slice(0, -1);
    interestsContent += "\n";
  });
  let ratingsContent = "userId,interestId,rating\n";
  let ratingsDocs = await ratings.find().toArray();
  ratingsDocs.forEach((d) => {
    ratingsContent += `${d.userId},${d.interestId},${d.rating}\n`;
  });
  return {
    interests: interestsContent.slice(0, -1),
    ratings: ratingsContent.slice(0, -1),
    ratings_len: ratingsDocs.length,
  };
};

// Fetch Neural-Network data.
module.exports.fetchDataForNN = async (uid) => {
  let train = [];
  let user = await users.find({ _id: ObjectId(uid) }).toArray();
  if (user.length > 0) {
    let activityLog = user[0].activityLog;
    for (const log of activityLog) {
      let aid = log.activity_id;
      let description = log.description;
      let label = log.label;
      train.push({
        activity_id: aid,
        description: description,
        label: label,
      });
    }
  }
  return train;
};

// Activity status updater
var interval = 10 * 60 * 1000; // min * sec * ms
async function updateActivityStatuses() {
  let actArray = await activities.find().toArray();
  for (const a of actArray) {
    try {
      if (
        a.status === "open" &&
        new Date(a.endDateTime.split(".")[0] < new Date())
      ) {
        activities.updateOne({ _id: a._id }, { $set: { status: "passed" } });
      }
    } catch (err) {
      console.error(`Database: could not update activity ${a.title} status`);
    }
  }
  console.log("Database: activity statuses updated.");
  setTimeout(updateActivityStatuses, interval);
}
setTimeout(updateActivityStatuses, interval);

// Create a user
module.exports.createUser = async function (userObject) {
  const user = { ...userObject };
  await users.insertOne(user);
  for (const int of user.interests) {
    let rating = {
      userId: user._id,
      interestId: int,
      rating: 10,
    };
    ratings.insertOne(rating);
  }
};

module.exports.createUserWithImage = async function (userObject, profileImage) {
  const user = { ...userObject, profileImage: profileImage };
  await users.insertOne(user);
  for (const int of user.interests) {
    let rating = {
      userId: user._id,
      interestId: int,
      rating: 10,
    };
    ratings.insertOne(rating);
  }
};

// Get User by ID.
module.exports.getUserById = async function (userId) {
  const result = await users.find({ _id: ObjectId(userId) }).toArray();
  return result[0];
};

// Get User by Email.
module.exports.getUserByEmail = async function (userEmail) {
  const result = await users.find({ email: userEmail }).toArray();
  return result[0];
};

//Update functions
async function changeUserFirstName(curr_user, firstName) {
  const result = await users.updateOne(
    { _id: curr_user.id },
    { $set: { firstName: firstName } }
  );
  return result;
}
async function changeUserLastName(curr_user, lastName) {
  const result = await users.updateOne(
    { _id: curr_user.id },
    { $set: { lastName: lastName } }
  );
  return result;
}
async function changeUserDateOfBirth(curr_user, dateOfBirth) {
  const result = await users.updateOne(
    { _id: curr_user.id },
    { $set: { dateOfBirth: dateOfBirth } }
  );
  return result;
}
async function changeUserAge(curr_user, age) {
  const result = await users.updateOne(
    { _id: curr_user.id },
    { $set: { age: age } }
  );
  return result;
}
async function changeUserCountry(curr_user, country) {
  const result = await users.updateOne(
    { _id: curr_user.id },
    { $set: { country: country } }
  );
  return result;
}
async function changeUserProfileImage(curr_user, profileImage) {
  const result = await users.updateOne(
    { _id: curr_user.id },
    { $set: { profileImage: profileImage } }
  );
  return result;
}
async function changeUserBio(curr_user, bio) {
  const result = await users.updateOne(
    { _id: curr_user.id },
    { $set: { bio: bio } }
  );
  return result;
}
async function changeUserFriendsList(curr_user, friendsList) {
  const result = await users.updateOne(
    { _id: curr_user.id },
    { $set: { friendsList: friendsList } }
  );
  return result;
}
async function changeUserIntrests(curr_user, intrests) {
  const result = await users.updateOne(
    { _id: curr_user.id },
    { $set: { intrests: intrests } }
  );
  return result;
}
async function changeUserActivityLog(curr_user, activityLog) {
  const result = await users.updateOne(
    { _id: curr_user.id },
    { $set: { activityLog: activityLog } }
  );
  return result;
}

module.exports.updateActivityParticipants = async function (
  activityId,
  participantsArr
) {
  const result = await activities.updateOne(
    { _id: ObjectId(activityId) },
    { $set: { participants: participantsArr } }
  );
  // Here we should update activity logs.
  return result;
};

// Create an interest (a.k.a category).
async function createNewInterest(newInterest) {
  const result = await client
    .db("activitygram")
    .collection("interests")
    .insertOne(newInterest.forDB);
  newInterest.set_id = result.insertedId;
  return result;
}

// Creat a tag.
async function createNewTag(client, newTag) {
  const result = await client
    .db("activitygram")
    .collection("tags")
    .insertOne(newTag.forDB);
  newTag.set_id = result.insertedId;
  return result;
}

// searchActivity

module.exports.searchActivity = async function (name) {
  const keyword = name ? name : "";
  console.log(keyword, name);
  const options = {
    $or: [
      { description: { $regex: keyword } },
      { title: { $regex: keyword } },
      { conditions: keyword },
      { group_managers: keyword },
      { participants: keyword },
      { tags: keyword },
    ],
  };
  activitiesFound = await activities.find(options).toArray();
  console.log(`found ${activitiesFound.length} activities`);
  return activitiesFound;
};

// searchUsers
module.exports.searchUsers = async function (name) {
  const keyword = name ? name : "";
  const options = {
    $or: [
      { firstName: { $regex: keyword } },
      { lastName: { $regex: keyword } },
      { bio: keyword },
      { city: keyword },
      { state: keyword },
      { school: keyword },
      { interests: keyword },
      { country: keyword },
    ],
  };
  //the search on the relevant collection
  usersFound = await users.find(options).toArray();
  console.log(`found ${usersFound.length} Users`);
  return usersFound;
};
// Create an activity.
module.exports.createNewActivity = async function (newActivity) {
  const result = activities.insertOne(newActivity);
  return result;
};

// Create a group.
async function createNewGroup(client, newGroup) {
  const result = await client
    .db("activitygram")
    .collection("groups")
    .insertOne(newGroup.forDB);
  newGroup.set_id = result.insertedId;
  return result;
}

// Get Activity by ID.
module.exports.getActivityById = async function (activityId) {
  const result = await activities.find({ _id: ObjectId(activityId) }).toArray();
  return result[0];
};

// Get Activities by category
module.exports.getActivitiesByCategory = async function (category) {
  const result = await activities.find({ category: category }).toArray();
  return result;
};

// Get All activities.
module.exports.getAllActivities = async function () {
  const result = await activities.find().toArray();
  return result;
};

// Get activities by id list
module.exports.getActivitiesByPred = async function (ids) {
  const obj_ids = ids.map((id) => {
    return ObjectId(id);
  });
  let fullActivities = await activities
    .find({ _id: { $in: obj_ids } })
    .toArray();
  return fullActivities;
};

// Get All Interests.
module.exports.getAllInterests = async function () {
  const result = await interests.find().toArray();
  array = [];
  for (const item of result) {
    if (item.title) {
      array.push({
        id: item._id.toString(),
        title: item.title,
      });
    }
  }
  return array;
};

// Get all users.
module.exports.getAllUsers = async function () {
  const result = await users.find().toArray();
  let array = [];
  for (const item of result) {
    if (item.firstName && item.lastName && item.email /*&& item.username*/) {
      array.push({
        id: item._id.toString(),
        title: item.firstName + " " + item.lastName + " (" + item.email + ")",
      });
    }
  }
  return array;
};
