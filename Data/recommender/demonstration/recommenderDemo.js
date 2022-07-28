const fs = require('fs');
const axios = require('axios');

const uri = 'http://127.0.0.1:8090/';
const readOptions = { encoding: 'utf8', flag: 'r' };

// Collaborative Filtering Training Simulation.
function train_cf() {
  let interests = fs.readFileSync('./interestsDemo.json', readOptions); // From the database.
  let ratings = fs.readFileSync('./ratingsDemo.json', readOptions);     // From the database.
  axios.post(`${uri}train_cf`, { interests: interests, ratings: ratings, })
    .then(
      (result) => {
        console.log("✅ train_cf request succeed.");
      },
      (err) => {
        console.log("⛔️ train_cf request failed.");
      }
    );
}

// Collaborative Filtering Prediction Simulation.
function predict_cf() {
  let uid = '627b785568c3ce7192123cd6'; // From request's params.
  let k = '3';                          // From request's params.
  let userbased = '1';                  // From request's params.
  axios
    .get(`${uri}predict_cf?uid=${uid}&k=${k}&userbased=${userbased}`)
    .then((result) => {
      console.log("✅ getInterestPrediction request succeeded.");
      console.log("results:");
      console.log(result.data);
    })
    .catch((err) => {
      console.error("⛔️ getInterestPrediction request failed.");
    });
}

// Neural Network Training Simulation.
function train_nn(uid) {
  let dataset = fs.readFileSync('./datasetDemo.json', readOptions); // From the database (with uid).
  axios
    .post(`${uri}/train_nn`, { uid: uid, train: JSON.parse(dataset), })
    .then(
      (result) => {
        console.log("✅ train_nn request succeed.");
      },
      (err) => {
        console.log("⛔️ train_nn request failed.");
      }
    );
}

// Neural Network Prediction Simulation.
function predict_nn(uid) {
  let test = fs.readFileSync('./testDemo.json', readOptions); // From request's body.
  axios
  .post(`${uri}/predict_nn`, { uid: uid, testSet: JSON.parse(test), })
  .then(
    (result) => {
      console.log("✅ predict_nn request succeed.");
      console.log("results:");
      console.log(result.data);
    },
    (err) => {
      console.log("⛔️ predict_nn request failed.");
    }
  );

}


let testUid = '6283c59f09c1aba370980c09'; // User: ShlomiAG

// train_cf();
// predict_cf();
// train_nn(testUid);
// predict_nn(testUid);
