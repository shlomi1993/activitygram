//Update functions
async function changeName(client, curr_tag, name){
  const result = await client.db("activitygram").collection("tags").updateOne(
      {"_id" : curr_tag.id},
      {$set:{name: name}}
  );
}

class Tag {
  constructor(name = 'name',
              similar_tags = []) {
    this.id = null;
    this.name = name;
    this.similar_tags = similar_tags;
    this.forDB = {name : name, 
                  similar_tags : similar_tags};
  }
  set set_id(val){
    this.id = val;
  }
}
module.exports = Tag;