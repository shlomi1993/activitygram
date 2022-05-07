const { MongoClient } = require('mongodb');

// TO-DO : try to put all the user functions in this file

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
              activityLog = []) { //array of events
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