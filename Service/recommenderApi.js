// Shlomi Ben-Shushan

const fs = require('fs');
const axios = require('axios');
const conn = JSON.parse(fs.readFileSync('./connections.json'));

const uri = `http://${conn.Recommender.ip}:${conn.Recommender.port}`;

// http://localhost:8090/train_cf?interests=../Data/recommender/datasets/debug/interests.csv&ratings=../Data/recommender/datasets/debug/ratings.csv
module.exports.train_cf = async function (interests_file, ratings_file) {
    let request = `${uri}/train_cf?interests=${interests_file}&ratings=${ratings_file}`;
    let result = null
    await axios
		.get(request)
		.then((res) => {
            result = res.data
		})
        .catch((error) => {
			console.error(error);
        });
    return JSON.parse(result)
};

// http://localhost:8090/predict_cf?uid=123464&k=10&userbased=1
module.exports.predict_cf = async function (uid, k, userbased) {
    let request = `${uri}/predict_cf?uid=${uid}&k=${k}&userbased=${userbased}`;
    let result = null
    await axios
		.get(request)
        .then((res) => {
            result = res.data
		})
        .catch((error) => {
			console.error(error);
        });
    return JSON.parse(result)
};

// http://localhost:8090/train_nn?uid=123464&train=../Data/recommender/datasets/train.json
module.exports.train_nn = async function (uid, train_file) {
    let request = `${uri}/train_nn?uid=${uid}&train=${train_file}`;
    let result = null
    await axios
		.get(request)
        .then((res) => {
            result = res.data
		})
        .catch((error) => {
			console.error(error);
        });
    return JSON.parse(result)
};

// http://localhost:8090/predict_nn?uid=123464&test=../Data/recommender/datasets/test.json
module.exports.predict_nn = async function (uid, test_file) {
    let request = `${uri}/predict_nn?uid=${uid}&test=${test_file}`
    let result = null
    await axios
		.get(request)
        .then((res) => {
            result = res.data
		})
        .catch((error) => {
			console.error(error);
        });
    return JSON.parse(result)
};
