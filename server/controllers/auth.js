const User = require("../models/user")
const Habit = require("../models/habit")
const validator = require('validator')
const bcrypt = require("bcrypt");
// TODO Validation
// TODO Error Handling

// Username normal function
exports.usernameValidation = async(req, res, next) => {
    message = '';
    charLimit = 25;
    username = req.body.username
    if(validator.isEmpty(username)) {
        message = "Username Required"
    }
    else if(username.length > charLimit) {
        message = "Username greater than {charLimit} characters!"

    }
    else if(validator.matches(username, '^[a-zA-Z0-9]*\_?[a-zA-Z0-9]+$')) {
        const user = await User.findOne({ username: username });
        if(user) {
            // Middleware function or a normal function?
            message = 'UserName Exists!'

        }
        else {
            next();
        }
    }
    if(message.length > 0)
        res.status(401).send(message)
    else
        next()
    // res.send(message)
}

exports.emailValidation = async(req, res, next) => {
    message = ''
    emailID = req.body.email
    if(validator.isEmpty(email)) {
        message = "Field must not be left Empty!"
        res.status(401)
    }
    else if(validator.isEmail(email)) {
        const user = await User.findOne({ email: email });
        if(user) {
            message = 'An account already exists with this email ID'
            res.status(401)
        }
        else {
            message = 'Available'
            res.status(200)
        }
    }
    else {
        message = "Email ID invalid"
        res.status(401)
    }
    res.send(message)
}

exports.requireAuth = async (req,res,next)=>{
    if (req.session.userId){
        next()
    }
    else {
        res.status(401).send("Require Authentication")
    }
}

exports.isLoggedIn = async (req,res,next)=>{
    res.setHeader('Content-Type', 'text/plain');
    if (req.session.userId){
        res.status(401)
        .send("Yes");
    }
    else {
        res.status(401)
        .send("No");
    }
}

exports.getUserDetails = async (req,res,next)=>{
    const user = await User.findById(req.session.userId)
    res.send({ username:user.name,email: user.email,userId:user._id })
}

exports.signup = async (req,res,next)=>{
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const passwordHash = await bcrypt.hash(password,12)
    const user = new User({
        username:username,
        password:passwordHash,
        email:email
    })
    await user.save()
    req.session.userId = user._id
    res.send("Ok") 
}

exports.login = async (req,res,next)=>{
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({
        email:email
    })
    if (user){
        console.log(user)
        if (await bcrypt.compare(password,user.password)){
            req.session.userId = user._id
            res.send("Ok")
        }
        else {
            res.status(401).send("Invalid Password")
        }
    }
    else{
        res.status(401).send("Email Not Found")
    }
}

exports.logout =  async (req,res,next)=>{
    req.session.destroy()
    res.send("Ok")
}

