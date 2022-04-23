const User = require("./User.js");
const { MongoClient } = require('mongodb');


 async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
async function changeUserName(client, newUser){
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertOne for the insertOne() docs
    const result = await client.db("activitygram").collection("users").insertOne(newUser.forDB);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function createNewUser(client, newUser){
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertOne for the insertOne() docs
    const result = await client.db("activitygram").collection("users").insertOne(newUser.forDB);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}
async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
     const uri = "mongodb+srv://shirziruni:Activitygram@cluster0.jjvsr.mongodb.net/Cluster0?retryWrites=true&w=majority";
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        new_user = new User()
        // Create a single new listing
        await createNewUser(client, new_user);
                            
        } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);