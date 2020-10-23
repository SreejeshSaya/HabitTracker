const User = require("../models/user");
// const Habit = require("../models/habit")
const validator = require("validator");
const bcrypt = require("bcrypt");

exports.usernameValidation = async (req, res, next) => {
   message = "";
   charLimit = 25;
   username = req.body.username;
   if (validator.isEmpty(username)) {
      message = "Username Required";
   } else if (username.length > charLimit) {
      message = `Username greater than ${charLimit} characters!`;
   } else if (validator.matches(username, "^[a-zA-Z0-9]*_?[a-zA-Z0-9]+$")) {
      const user = await User.findOne({ username: username });
      if (user) {
         // Middleware function or a normal function?
         message = "UserName Exists!";
      } else {
         console.log(`Username ${username} is valid`);
         next();
      }
   } else {
      message = "Username Invalid";
   }
   if(message) {
      res.status(401);
      res.send(message);
   }
   // if (message.length > 0) res.status(401).send(message)
   // else next()
   // res.send(message)
};

exports.emailValidation = async (req, res, next) => {
   message = "";
   emailId = req.body.email;
   if (validator.isEmpty(emailId)) {
      message = "Email Id Empty!";
   } else if (validator.isEmail(emailId)) {
      console.log("Email Valid");
      // next()
      const user = await User.findOne({ email: emailId });
      if (user) {
         // console.log(user)
         message = `An account already exists with this email ${emailId} `;
         console.log(message);
      } else {
         next();
      }
   } else {
      message = "Email ID invalid";
   }
   if(message) {
      res.status(401);
      res.send(message);
   }
};

exports.loginValidation = async (req, res, next) => {
   message = "";
   emailId = req.body.email;
   console.log(emailId);
   if (validator.isEmpty(emailId)) {
      message = "Field must not be left Empty!";
   } else if (validator.isEmail(emailId)) {
      console.log("Email Valid");
      next();
      // const user = await User.findOne({ email: email })
      // if (user) {
      // 	message = "An account already exists with this email ID"
      // 	res.status(401)
      // } else {
      // 	message = "Available"
      // 	res.status(200)
      // }
   } else {
      message = "Email ID invalid";
      console.log(message);
   }
   if(message) {
      res.status(401);
      res.send(message);
   }
};

exports.requireAuth = async (req, res, next) => {
   if (req.session.userId) {
      next();
   } else {
      res.status(401).send("Require Authentication");
   }
};

exports.isLoggedIn = async (req, res, next) => {
   res.setHeader("Content-Type", "text/plain");
   if (req.session.userId) {
      res.status(401).send("Yes");
   } else {
      res.status(401).send("No");
   }
};

exports.getUserDetails = async (req, res, next) => {
   const user = await User.findById(req.session.userId);
   res.send({
      username: user.username,
      email: user.email,
      userId: user._id,
      createdAt: user.createdAt,
      profileImageUrl: user.profileImageUrl,
   });
};

exports.updateUserDetails = async (req, res, next) => {
   const user = await User.findById(req.session.userId);
   if (!user) {
      return {
         error: "User not found",
      };
   } else {
      console.log("recvvvv", req.body.username);
      if (req.body.username) {
         user.username = req.body.username;
      }
      if (req.body.profileImageUrl){
         user.profileImageUrl = req.body.profileImageUrl
         delete req.session.tempImage
      }
   }
   await user.save();
   res.send({
      username: user.username,
      email: user.email,
      userId: user._id,
      createdAt: user.createdAt,
      profileImageUrl: user.profileImageUrl
   });
};

exports.signup = async (req, res, next) => {
   const username = req.body.username;
   const password = req.body.password;
   const email = req.body.email;
   const passwordHash = await bcrypt.hash(password, 12);
   const user = new User({
      username: username,
      password: passwordHash,
      email: email,
   });
   await user.save();
   req.session.userId = user._id;
   res.send("Ok");
};

exports.login = async (req, res) => {
   const email = req.body.email;
   const password = req.body.password;
   const user = await User.findOne({
      email: email,
   });
   if (user) {
      // console.log(user);
      console.log(`${user.username} exists`)
      if (await bcrypt.compare(password, user.password)) {
         console.log('Password Valid')
         req.session.userId = user._id;
         res.status(200);
         res.send("Ok");
      } else {
         res.status(401).send("Invalid Password");
      }
   } else {
      console.log("User does not exist")
      res.status(401)
      res.send("Email Not Found");
   }
};

exports.logout = async (req, res, next) => {
   req.session.destroy();
   res.send("Ok");
};
