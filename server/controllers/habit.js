const Habit = require("../models/habit");
const History = require("../models/history");
const { removeTime, daysDifference } = require("../utils/dateManager");
const User = require("../models/user");
const StatHistory = require("../models/stathistory")

const  {onCompleteToday,onRemoveCompleteToday} = require("../triggers/updatestreak")

exports.addHabit = async (req, res, next) => {
   const userId = req.session.userId;
   const text = req.body.text;
   const color = req.body.color;
   let endDate = new Date(req.body.endDate);
   endDate = isNaN(endDate.getTime())
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      : endDate;
   const habit = new Habit({
      user: userId,
      text: text,
      endDate: endDate,
      color,
   });
   await habit.save();
   res.send(habit);
};

exports.updateHabit = async (req, res, next) => {
   const habitId = req.body.habitId;
   const habitText = req.body.text;
   const habitColor = req.body.color;
   const endDate = req.body.endDate;
   const habit = await Habit.findById(habitId);
   if (!habit) {
      res.setHeader("Content-Type", "text/plain");
      res.status(403).send("Habit not found");
   } else {
      if (habitText) {
         habit.text = habitText;
      }
      if (habitColor) {
         habit.color = habitColor;
      }
      if (endDate && !isNaN(new Date(endDate))) {
         habit.endDate = endDate;
      }
      await habit.save();
      res.send(habit);
   }
};

exports.getUserHabits = async (req, res, next) => {
   const userId = req.session.userId;
   const habits = await Habit.find({
      user: userId,
   });

   res.send(habits);
};

exports.deleteHabit = async (req, res, next) => {
   const habitId = req.body.habitId;
   await Habit.findByIdAndDelete(habitId);
   res.send("Ok");
};

exports.completeHabitToday = async (req, res, next) => {
   const habitId = req.body.habitId;
   const habit = await Habit.findById(habitId);
   if (habit.user.toString()!=req.session.userId){
      return res.status(403).send("Invalid user")
   }

   if (!habit) {
      return res.status(403).send("Habit not found");
   }

   const user = await User.findById(habit.user)
   const lastDate  = habit.getLastCompletedDate()
   console.log(daysDifference(lastDate,removeTime(new Date())),lastDate,new Date())
   if (lastDate && daysDifference(lastDate,removeTime(new Date()))==0 ){
      return res.status(403).send("Already completed today")
   }

   onCompleteToday(user,habit)
   await habit.save();
   await user.save();
   console.log("success complete")
   res.status(200).send(habit);
};

exports.removeCompleteToday = async (req, res, next) => {
   const habitId = req.body.habitId;
   const habit = await Habit.findById(habitId);
   
   if (habit.user.toString()!=req.session.userId){
      console.log(habit.user.toString(),req.session.userId)
      return res.status(403).send("Invalid user")
   }

   if (!habit) {
      return res.status(403).send("Habit not found");
   }

   if (!habit.history[habit.history.length - 1]) {
      return res.status(503).send("Invalid Request")
   }

   const user = await User.findById(habit.user)
   
   const lastDate = habit.getLastCompletedDate()
   if (daysDifference(lastDate,removeTime(new Date()))!=0){
      return res.status(503).send("Not completed today")
   }

   onRemoveCompleteToday(user,habit)
   await habit.save()
   await user.save()
   res.status(200).send(habit);
};

exports.getUserPublicData = async (req, res, next) => {
   const userId = req.query.userId;
   if (!userId){
      return res.status(503).send({error: "Malformed Request"})
   }

   let user;
   try {
      user = await User.findById(userId).select("-password");
   }
   catch(e){ // handle error here instead of the catchall handler in app.js
      
      return res.status(404).send({
         error:"User not found"
      })
   }
   
   //Get only the history which is required for streak calculation. Ignore all other personal details like habit name etc
   const habits = await Habit.find({
      user: userId,
   })
      .select("history createdAt");
   res.send({...user.toObject(),habits: habits });
};

// TODO: Pagination, this currently returns all users in one request
exports.getLeaderBoard = async function(req,res,next){
   const users = await User.find({}).sort("-habitScore").select("habitScore username profileImageUrl")
   res.send(users)
}

exports.getPublicStats = async function(req,res,next){
   const stats = await StatHistory.findOne({})
   if (!stats){
      return res.status(503).send({
         error:"No stats available"
      })
   }
   res.send(stats)
}
