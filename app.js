const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = process.env.port || 4000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/www'));
const users = {'user1': 'password1','user2': 'password2'};
app.post('/login', (req, res) => {
    // get username from the client form data
    const username = req.body.username;
    const password = users[username];
    //check if the passwords are equal
    if (password && password === req.body.password) {
        res.cookie('username', username);
        res.redirect("/admin");
    }
    res.send('Failed to login!')
})
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/admin')
});
const isAuthenticated = (req, res, next) => {
    if (!req.cookies.username){
        res.status(401);
        res.send('Access Forbidden');
    }    
    next();
}
app.use("/admin",isAuthenticated,express.static(__dirname + '/admin'));
console.log("Server listening at " + port);
app.listen(port); 