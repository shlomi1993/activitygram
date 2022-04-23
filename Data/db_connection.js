const User = require("./User.js");
const { MongoClient } = require('mongodb');

// print databases
 async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
async function connectToDB() {
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
connectToDB().catch(console.error);