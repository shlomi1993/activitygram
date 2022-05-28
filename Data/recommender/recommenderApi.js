// Shlomi Ben-Shushan

const fs = require('fs');
const axios = require('axios');
const conn = JSON.parse(fs.readFileSync('./connections.json'));

const uri = `http://${conn.Recommender.ip}:${conn.Recommender.port}`;

module.exports.train_cf = async function(interests_csv, ratings_csv) {
	let request = `${uri}/train_cf?interests=${interests_csv}&ratings=${ratings_csv}`;
	let result = null;
	await axios
		.get(request)
		.then((res) => {
			result = res.data;
		})
		.catch((error) => {
			console.error(error);
		});
	return JSON.parse(result);
};

module.exports.predict_cf = async function(uid, k, userbased) {
	let request = `${uri}/predict_cf?uid=${uid}&k=${k}&userbased=${userbased}`;
	let result = null;
	await axios
		.get(request)
		.then((res) => {
			result = res.data;
		})
		.catch((error) => {
			console.error(error);
		});
	return result; //JSON.parse(result);
};

module.exports.train_nn = async function(uid, train_file) {
	let request = `${uri}/train_nn?uid=${uid}&train=${train_file}`;
	let result = null;
	await axios
		.get(request)
		.then((res) => {
			result = res.data;
		})
		.catch((error) => {
			console.error(error);
		});
	return JSON.parse(result);
};

module.exports.predict_nn = async function(uid, test_file) {
	let request = `${uri}/predict_nn?uid=${uid}&test=${test_file}`;
	let result = null;
	await axios
		.get(request)
		.then((res) => {
			result = res.data;
		})
		.catch((error) => {
			console.error(error);
		});
	return JSON.parse(result);
};
