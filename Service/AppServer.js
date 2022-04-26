var path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(fileUpload());

app.get('/', (req, res) => {
    // res.sendFile('./index.html');
    console.log("GET recieved in AppServer.");
});


app.post('/TEST', (req, res) => {
    console.log("post recieved");
});

app.listen(8080, () => console.log('AppServer is up!'));
