const fs = require("fs");
const express = require("express");
const { PythonShell } = require("python-shell");
const db = require("../Data/database/db_connection");
const conn = JSON.parse(fs.readFileSync("connections.json"));

const dbClient = db.createMongoClient(conn.Database.uri);
dbClient.connect();

let python = new PythonShell("../Data/recommender/recommender.py");
python.on("message", (message) => {
  console.log("Recommender: " + message);
});

const app = express();

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/", (req, res) => {
	res.send("AppServer pong");
  console.log("AppServer pong");
});

app.get("/getEvent", (req, res) => {
	let eid = req.query.event_id;
  db.getEventById(dbClient, eid).then((event) => res.send(event));
});

app.post("/setEvent", (req, res) => {
  console.log("setEvent recieved");
});

app.listen(conn.App.port, () => console.log("AppServer is up!"));

// DONT FORGET TO CLOSE DB CLIENT!
