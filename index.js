const JSONdb = require('simple-json-db');

const path = require('path');

const express = require('express');
const app = express();

const http = require('http')

//const subdomain = require('express-subdomain');
const admin = require(path.join(__dirname, 'admin/admin'));


app.use('/admin', admin);
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public'), { /*index: false,*/ extensions: ['html'] }));

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/images/favicon.ico'))
});


http.createServer(app).listen(5500);