const { MongoClient } = require('mongodb');

//Update functions
async function changeName(client, curr_interest, name){
  const result = await client.db("activitygram").collection("interest").updateOne(
      {"_id" : curr_interest.id},
      {$set:{name: name}}
  );
}

class Interest {
  constructor(name = 'name', 
              image = null,
              description = null,
              tags = []) {
    this.id = null;
    this.name = name;
    this.image = image;
    this.description = description;
    this.tags = tags;
    this.forDB = {name : name, 
                  image : image,
                  description : description,
                  tags : tags};
  }
  set set_id(val){
    console.log("setting id")
    this.id = val;
  }
}
module.exports = Interest;