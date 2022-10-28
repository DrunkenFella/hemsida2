const JSONdb = require('simple-json-db');

const crypto = require("crypto");

function sha256(data) {
    return crypto.createHash("sha256").update(data, "binary").digest("base64");
    //                                               ------  binary: hash the byte string
}
function getSalt() {
    return crypto.randomBytes(128).toString('base64');
}

sha256("string or binary");

const path = require('path');

const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const http = require('http')

//const subdomain = require('express-subdomain');
const admin = require(path.join(__dirname, 'admin/admin'));

const urlencodedParser = bodyParser.urlencoded({ extended: false })
//Open DB:s

app.use(urlencodedParser);

const users = new JSONdb(path.join(__dirname, '/db/users.json'));
const admins = new JSONdb(path.join(__dirname, '/db/admins.json'));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use('/admin', admin);
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ["html"] }));

app.get('/categorys', (req, res) => {
    res.sendFile(path.join(__dirname, 'categorys.json'));
});

app.get('/games', (req, res) => {
    res.sendFile(path.join(__dirname, 'games.json'));
});

app.post('/signIn', (req, res) => {
    if (users.has(req.body.email)) {
        if (users.get(req.body.email).password == sha256(req.body.password + users.get(req.body.email).salt)) {
            res.cookie('loggedIn', { 'username': req.body.email, 'key': getSalt() });
            res.end(`logedin as ${req.body.email}`);
        }
        else {
            res.end();
        }
    }
    else if (admins.has(req.body.Name)) {
        if (admins.get(req.body.Name).password == sha256(req.body.Password + admins.get(req.body.Name).salt)) {
            res.end(`logedin as admin ${req.body.Name}`)
        }
        else {
            res.end();
        }
    }
    else {
        for (let key in users.JSON()) {
            console.log(key);
            console.log(users.get(key));
            if (users.get(key).email == req.body.email) {
                res.cookie('loggedIn', { 'username': key, 'key': getSalt() });
                res.end(`logedin as ${key}`)
            }
        }
        res.end();
    }
});
app.post('/signUp', (req, res) => {
    if (users.has(req.body.username)) {
        res.end("Usernaem Taken")
    }
    else {
        salt = getSalt();
        users.set(
            req.body.username,
            {
                "password": sha256(req.body.password + salt),
                "salt": salt,
                "email": req.body.email,

            }
        )

        res.cookie('loggedIn', { 'username': req.body.username, 'key': getSalt() });
        res.redirect('/');
    }
});
//Iterate users data from cookie
app.get('/getuser', (req, res) => {
    //shows all the cookies
    res.send(req.cookies);
});
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/images/favicon.ico'))
});


http.createServer(app).listen(5000);