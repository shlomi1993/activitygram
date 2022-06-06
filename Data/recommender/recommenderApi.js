// Shlomi Ben-Shushan

const fs = require('fs');
const axios = require('axios');
const conn = JSON.parse(fs.readFileSync('./connections.json'));

const uri =  `http://${conn.Geocoder.ip}:${conn.Geocoder.port}`;

module.exports.geocode = async function (address) {
    let request = `${uri}/geocode?address=${address}`;
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
