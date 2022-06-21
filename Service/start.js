const conn = JSON.parse(require('fs').readFileSync('./connections.json'));
const { PythonShell } = require('python-shell');

let options1 = {
    pythonOptions: ['-u'],
    args: [conn.Recommender.ip, conn.Recommender.port]
};

process.chdir('../Data/recommender');
const recommenderService = new PythonShell('./recommender.py', options1);
recommenderService.on('message', (message) => {
    console.log('Recommender: ' + message);
});

let options2 = {
    pythonOptions: ['-u'],
    args: [conn.Geocoder.ip, conn.Geocoder.port]
};

process.chdir('../geocoder');
const geocoderService = new PythonShell('./geocoder.py', options2);
geocoderService.on('message', (message) => {
    console.log('Geocoder: ' + message);
});

process.chdir('../../Service');

const app = require('./AppServer');
