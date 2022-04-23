class User {
  constructor(firstName = 'name', 
              lastName= 'last',
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
                  intrests:intrests ,
                  activityLog:activityLog};
  }
  set set_id(val){
    console.log("setting id")
    this.id = val;
  }
}
module.exports = User;