const User = require("../models/user")
const Habit = require("../models/habit")

const bcrypt = require("bcrypt");
// TODO Validation
// TODO Error Handling

exports.requireAuth = async (req,res,next)=>{
    if (req.session.userId){
        next()
    }
    else {
        res.status(403).send("Require Authentication")
    }
}

exports.isLoggedIn =async (req,res,next)=>{
    res.setHeader('Content-Type', 'text/plain');
    if (req.session.userId){
        res.send("Yes")
    }
    else {
        res.send("No")
    }
}

exports.getUserDetails = async (req,res,next)=>{
    const user = await User.findById(req.session.userId)
    res.send({ username:user.name,email: user.email,userId:user._id })
}


exports.signup =  async (req,res,next)=>{
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

exports.login =  async (req,res,next)=>{
    const email = req.body.email
    const password = req.body.password
    const user  =await User.findOne({
        email:email
    })
    if (user){
        console.log(user)
        if (await bcrypt.compare(password,user.password)){
            req.session.userId = user._id
            res.send("Ok")
        }
        else {
            res.status(403).send("Invalid Password ")
        }
    }
    else{
        res.status(403).send("Email Not Found")
    }
}

exports.logout =  async (req,res,next)=>{
    req.session.destroy()
    res.send("Ok")
}

