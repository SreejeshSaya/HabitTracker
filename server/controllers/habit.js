const Habit = require("../models/habit");
const History = require("../models/history");
const { removeTime } = require("../utils/dateManager");
const User = require("../models/user");

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
   const habit = await Habit.findById(habitId).populate("history");
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
      res.send(habit.populate());
   }
};

exports.getUserHabits = async (req, res, next) => {
   const userId = req.session.userId;
   const habits = await Habit.find({
      user: userId,
   }).populate("history");

   res.send(habits);
};

exports.deleteHabit = async (req, res, next) => {
   const habitId = req.body.habitId;
   await Habit.findByIdAndDelete(habitId);
   res.send("Ok");
};

exports.completeHabitToday = async (req, res, next) => {
   const habitId = req.body.habitId;
   const habit = await Habit.findById(habitId).populate("history");
   if (habit.user.toString()!=req.session.userId){
      return res.status(403).send("Invalid user")
   }

   if (!habit) {
      return res.status(403).send("Habit not found");
   }

   const user = await User.findById(habit.user)

   if (habit.history[habit.history.length - 1]) {
      let lastDate = new Date(habit.history[habit.history.length - 1].date);
      console.log(lastDate, removeTime(lastDate));
      if (removeTime(lastDate) >= removeTime(new Date()))
         return res.status(403).send("Already completed today");
   }
   const history = new History();
   habit.history.push(history);

   habit.updateCompletionDetails(user);
   await habit.updateMax(user);
   await habit.save();
   await history.save();
   await user.save();
   console.log("success complete")
   res.status(200).send(habit);
};

exports.removeCompleteToday = async (req, res, next) => {
   const habitId = req.body.habitId;
   const habit = await Habit.findById(habitId).populate("history");
   
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
   
   let lastDate = habit.history[habit.history.length - 1].date
   console.log(removeTime(lastDate),removeTime(new Date()))
   if (removeTime(lastDate).valueOf() != removeTime(new Date()).valueOf() ) {
      return res.status(403).send("Not completed today");
   }

   await habit.removeCompleteToday(user);
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
      .populate("history")
      .select("history createdAt");
   res.send({...user.toObject(),habits: habits });
};

// TODO: Pagination, this currently returns all users in one request
exports.getLeaderBoard = async function(req,res,next){
   const users = await User.find({}).sort("-habitScore").select("habitScore username profileImageUrl")
   res.send(users)
}