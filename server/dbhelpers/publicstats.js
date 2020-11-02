const db = require("../utils/db");
const mongoose = require("mongoose");
const  {removeTime,daysDifference} = require('../utils/dateManager')
const Habit = require("../models/habit");
const User = require("../models/user");
const StatHistory = require("../models//stathistory");
const user = require("../models/user");

async function gethabitSampleLastNDays(n,limit){
   const lastDate = new Date(removeTime(new Date())-n*1000*60*60*24)

   const habits = await Habit.find({
      createdAt:{
         $gte:lastDate
      }
   }).limit(limit)

   let avgLength = habits.map(h=>{
      return daysDifference(removeTime(h.createdAt),removeTime(h.endDate))
   }).filter(a=>a>0)//some invalid habits are present in db (enddate<createdate) will remove them later
   .sort((a,b)=>a-b)

   const users = await User.find({
      punctualityHistory:{
         $elemMatch:{//atleast one puncutality updated after the last date
            date:{
               $gte:lastDate
            }
         }
      }
   }).limit(limit)
   console.log(users.length)
   let avgPunctuality = users.map(u=>{
      const recentP =  u.punctualityHistory
      .filter(p=>p.date>=lastDate)
      .map(p=>p.punctuality)
      console.log(recentP.length)
      return recentP.reduce((p1,p2)=>p1+p2)/recentP.length//average of punctuality in last 14 days
   }).sort((a,b)=>a-b)

   let stats = await StatHistory.findOne({})
   if (!stats){
      stats = new StatHistory({
         avgLengthHabit:avgLength,
         avgPunctualityUser:avgPunctuality,
         totalhabitsCreated:avgLength.length,
         updatedAt:new Date()
      })
   }
   else {
      stats.avgLengthHabit=avgLength,
      stats.avgPunctualityUser=avgPunctuality,
      stats.totalhabitsCreated=avgLength.length,
      stats.updatedAt=new Date()
   }
   await stats.save()
}


mongoose
   .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
   })
   .then(() => {
      return gethabitSampleLastNDays(10,100)
   })
   .then(()=>{
      return mongoose.connection.close()
   })