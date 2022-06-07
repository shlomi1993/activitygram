const fs = require('fs');
const axios = require('axios');
const conn = JSON.parse(fs.readFileSync('./connections.json'));

const uri = `http://${conn.Geocoder.ip}:${conn.Geocoder.port}`;

module.exports.geocode = async function(address) {
	let request = `${uri}/geocode?address=${address}`;
	let result = null;
	await axios
		.get(request)
		.then((res) => {
			result = res.data;
		})
		.catch((error) => {
			console.error('geocode request failed:', error.response.status, error.response.statusText);
        });
	return JSON.parse(JSON.stringify(result));
};

module.exports.reverse = async function(latitude, longitude) {
	let request = `${uri}/reverse?latitude=${latitude}&longitude=${longitude}`;
	let result = null;
	await axios
		.get(request)
		.then((res) => {
			result = res.data;
		})
		.catch((error) => {
			console.error('reverse request failed:', error.response.status, error.response.statusText);
        });
	return JSON.parse(JSON.stringify(result));
};