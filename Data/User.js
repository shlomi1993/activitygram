const { MongoClient } = require('mongodb');

//Update functions
async function changeFirstName(client, curr_user, firstName){
  const result = await client.db("activitygram").collection("users").updateOne(
      {"_id" : curr_user.id},
      {$set:{firstName: firstName}}
  );
}
async function changeLastName(client, curr_user, lastName){
  const result = await client.db("activitygram").collection("users").updateOne(
      {"_id" : curr_user.id},
      {$set:{lastName: lastName}}
  );
}
async function changeDateOfBirth(client, curr_user, dateOfBirth){
  const result = await client.db("activitygram").collection("users").updateOne(
      {"_id" : curr_user.id},
      {$set:{dateOfBirth: dateOfBirth}}
  );
}
async function changeAge(client, curr_user, age){
  const result = await client.db("activitygram").collection("users").updateOne(
      {"_id" : curr_user.id},
      {$set:{age: age}}
  );
}
async function changeCountry(client, curr_user, country){
  const result = await client.db("activitygram").collection("users").updateOne(
      {"_id" : curr_user.id},
      {$set:{country: country}}
  );
}
async function changeProfileImage(client, curr_user, profileImage){
  const result = await client.db("activitygram").collection("users").updateOne(
      {"_id" : curr_user.id},
      {$set:{profileImage: profileImage}}
  );
}
async function changeBio(client, curr_user, bio){
  const result = await client.db("activitygram").collection("users").updateOne(
      {"_id" : curr_user.id},
      {$set:{bio: bio}}
  );
}
async function changeFriendsList(client, curr_user, friendsList){
  const result = await client.db("activitygram").collection("users").updateOne(
      {"_id" : curr_user.id},
      {$set:{friendsList: friendsList}}
  );
}
async function changeIntrests(client, curr_user, intrests){
  const result = await client.db("activitygram").collection("users").updateOne(
      {"_id" : curr_user.id},
      {$set:{intrests: intrests}}
  );
}
async function changeActivityLog(client, curr_user, activityLog){
  const result = await client.db("activitygram").collection("users").updateOne(
      {"_id" : curr_user.id},
      {$set:{activityLog: activityLog}}
  );
}
//creat newUser
async function createNewUser(client, newUser){
  const result = await client.db("activitygram").collection("users").insertOne(newUser.forDB);
  newUser.set_id = result.insertedId;
  console.log(`New listing created with the following id: ${result.insertedId}`);
}
class User {
  constructor(firstName = 'firstName', 
              lastName= 'lastName',
              dateOfBirth = Date(),
              age = 25,
              country = 'Israel',
              profileImage = null,
              bio = null,
              friendsList = null,
              intrests = null,
              activityLog = null) {
    this.id = null;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.age = age;
    this.country = country;
    this.profileImage = profileImage;
    this.bio = bio;
    this.friendsList = friendsList;
    this.intrests = intrests;
    this.activityLog = activityLog;
    this.forDB = {firstName : firstName, 
                  lastName : lastName,
                  dateOfBirth : dateOfBirth,
                  age : age,
                  country : country,
                  profileImage :profileImage,
                  bio:bio, 
                  friendsList:friendsList, 
                  intrests:intrests,
                  activityLog:activityLog};
  }
  set set_id(val){
    console.log("setting id")
    this.id = val;
  }
  set set_firstName(val){
    console.log("setting firstName")
    this.firstName = val;
  }
  set set_lastName(val){
    console.log("setting lastName")
    this.lastName = val;
  }
  set set_dateOfBirth(val){
    console.log("setting dateOfBirth")
    this.dateOfBirth = val;
  }
  set set_age(val){
    console.log("setting age")
    this.age = val;
  }
  set set_country(val){
    console.log("setting country")
    this.country = val;
  }
  set set_profileImage(val){
    console.log("setting profileImage")
    this.profileImage = val;
  }
  set set_bio(val){
    console.log("setting bio")
    this.bio = val;
  }
  set set_friendsList(val){
    console.log("setting friendsList")
    this.friendsList = val;
  }
  set set_intrests(val){
    console.log("setting intrests")
    this.intrests = val;
  }
  set set_activityLog(val){
    console.log("setting activityLog")
    this.activityLog = val;
  }
}
module.exports = User;