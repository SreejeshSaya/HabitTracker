const Habit = require("../models/habit");
const History = require("../models/history");
const { removeTime, daysDifference } = require("../utils/dateManager");
const User = require("../models/user");
const StatHistory = require("../models/stathistory")
const Sample = require("../models/sample")
const  {onCompleteToday,onRemoveCompleteToday} = require("../triggers/updatestreak");
const user = require("../models/user");
const samples = require("../samples");
const { off } = require("../models/user");

exports.addHabit = async (req, res, next) => {
   const userId = req.session.userId;
   const text = req.body.text;
   const color = req.body.color;
   let endDate = new Date(req.body.endDate);
   const tags = req.body.tags || []
   endDate = isNaN(endDate.getTime())
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      : endDate;

   const habit = new Habit({
      user: userId,
      text: text,
      endDate: endDate,
      color:color,
      tags: tags
   });
   await habit.save();
   res.send(habit);
};

exports.updateHabit = async (req, res, next) => {
   const habitId = req.body.habitId;
   const habitText = req.body.text;
   const habitColor = req.body.color;
   const endDate = req.body.endDate;
   const habitTags = req.body.tags
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
      if (habitTags){
          habit.tags = habitTags
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
   const pageSize = Math.max(0,+req.query.pageSize) || 50
   const pageNumber = Math.max(0,+req.query.pageNumber) || 1
   const offset = (pageNumber-1)*pageSize
   const users = await User.find({}).sort("-habitScore").select("habitScore username profileImageUrl").skip(offset).limit(pageSize)
   const userSize = await User.countDocuments({})
   const totalPages = Math.ceil(userSize/pageSize)
   res.send({
      pageNumber:pageNumber,
      pageSize:pageSize,
      totalPages:totalPages,
      totalSize:userSize,
      data:users
   })
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

exports.getTrendingTags = async function(req,res,next){
    const limit = req.query.limit || 100
    const stats = await StatHistory.findOne({})
    const tags = stats.tagFrequency.slice(0,limit+1)
    return tags
}

exports.getRecommendedTags = async function(req,res,next){
    const samples = await Sample.findOne({})
    const tags = Object.keys(samples.samples)

    const userId = req.session.userId
    const userHabits = await Habit.find({
        user:userId
    }).limit(100)

    const userTags = userHabits.reduce((agg,h)=>{
        for (let t of h.tags){
            agg[t]  = (agg[t] || 0) + 1
        }
        return agg
    },{})

    tags.sort((t1,t2)=>{
        return (userTags[t2] || 0 ) - (userTags[t1] || 0 )
    })
    res.send(tags.slice(0,6))
}

exports.getSamples =async (req,res,next)=>{
    console.log("here")
    const samples = await Sample.findOne({})
    const tags = Object.keys(samples.samples)
    res.send({
        tags:tags,
        tagHabits:samples.samples
    })
}

exports.completeUpdates = async (req,res,next)=>{
   const ids = req.body.map(k=>{
      return k[1]
   })
   const habits = await Habit.find({
      _id:{
         $in:ids
      }
   });
   const user = await User.findById(req.session.userId)//need to verify
   let response = []
   for (let [type,id] of req.body){
      let habit = habits.find(h=>h.id==id)
      const lastDate  = habit.getLastCompletedDate();
      if (type=="complete"){
         if (lastDate && daysDifference(lastDate,removeTime(new Date()))==0 ){
            return res.status(403).send({error:habit.text+": already completed"})
         }
         onCompleteToday(user,habit)
      }
      else {
         if (lastDate && daysDifference(lastDate,removeTime(new Date()))==0 ){
            onRemoveCompleteToday(user,habit)
         }
         else {
            return res.status(403).send({error:habit.text+": not completed"})
         }
      }
      response.push(habit)
   }
   const bulk = Habit.collection.initializeOrderedBulkOp()
   for (let h of habits){
      bulk.find({_id:h._id}).update({
         $set:h.toObject()
      })
   }
   
   await bulk.execute()
   await user.save()
   res.send(response)
}

