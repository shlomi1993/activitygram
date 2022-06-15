// Shlomi Ben-Shushan

const fs = require('fs');
const axios = require('axios');
const conn = JSON.parse(fs.readFileSync('./connections.json'));

// const { PythonShell } = require('python-shell');
// const recommenderService = new PythonShell('../Data/recommender/recommender.py');
// recommenderService.on('message', (message) => {
//     console.log('Recommender: ' + message);
// });

const uri = `http://${conn.Recommender.ip}:${conn.Recommender.port}`;

module.exports.train_cf = async function (interests_csv, ratings_csv) {
    let request = `${uri}/train_cf?interests=${interests_csv}&ratings=${ratings_csv}`;
    let result = null;
    await axios
        .get(request)
        .then((res) => { result = res.data; })
        .catch((err) => { console.error('train_cf request failed'); });
    return result;
};

module.exports.predict_cf = async function (uid, k, userbased) {
    let request = `${uri}/predict_cf?uid=${uid}&k=${k}&userbased=${userbased}`;
    let result = null;
    await axios
        .get(request)
        .then((res) => { result = res.data; })
        .catch((err) => { console.error('predict_cf request failed'); });
    return result; //JSON.parse(result);
};

module.exports.train_nn = async function (uid, train_file) {
    let request = `${uri}/train_nn?uid=${uid}&train=${train_file}`;
    let result = null;
    await axios
        .get(request)
        .then((res) => { result = res.data; })
        .catch((err) => { console.error('train_nn request failed'); });
    return JSON.parse(result);
};

module.exports.predict_nn = async function (uid, tests) {
    let results = null
    await axios.post(`${uri}/predict_nn`, {
        uid: uid,
        testSet: tests
    })
        .then((response) => {
            results = JSON.stringify(response.data)
        }, (error) => {
            console.log('predict_nn request failed.');
        });
    return results;
};