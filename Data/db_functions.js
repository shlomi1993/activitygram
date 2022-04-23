const User = require("./User.js");
const { MongoClient } = require('mongodb');

// print databases
 async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function changeUserName(client, curr_user, new_name){
    const result = await client.db("activitygram").collection("users").updateOne(
        {
            // used to filter the document
            "_id" : curr_user.id
        },
        {
        $set:{
            firstName: new_name
            }
        }
);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

//creat newUser
async function createNewUser(client, newUser){
    const result = await client.db("activitygram").collection("users").insertOne(newUser.forDB);
    console.log(newUser.id)
    newUser.set_id = result.insertedId;
    console.log(newUser.id)
    console.log(`New listing created with the following id: ${result.insertedId}`);
}
async function main() {
    const uri = "mongodb+srv://shirziruni:Activitygram@cluster0.jjvsr.mongodb.net/Cluster0?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        new_user = new User()
        // Create a single new listing
        await createNewUser(client, new_user);
        await changeUserName(client, new_user, "SHLOMI");
        } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);