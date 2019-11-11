const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app 
});

app.get('/', (req, res) => res.render('index.html', {section: 'Index'}));

app.get('/:username', (req, res) => res.render('user.html', {username: req.params.username, section: 'Usernames'}));
app.get('/:username/connections', (req, res) => res.render('connections.html', {username: req.params.username, section: 'Connections'}));



app.listen(3000, () => console.log("Server is working"));

