const db = require("../utils/db");
const mongoose = require("mongoose");
const  {removeTime,daysDifference} = require('../utils/dateManager')
const Habit = require("../models/habit");
const User = require("../models/user");
const History = require("../models/history");

function onCompleteToday(user,habit,dateChecked){
   let lastDate=habit.createdAt,lastStreak=0,userStreak=0;
   if (habit.history2.length) {
      lastDate= habit.history2[habit.history2.length-1].date
      lastStreak = habit.history2[habit.history2.length-1].streak
   }
   lastDate =  removeTime(lastDate)
   const now = removeTime(dateChecked)
   const startDate = removeTime(habit.createdAt)
   const diff= daysDifference(startDate,now)
   const p = Math.floor((habit.history2.length+1)/(diff+1)*100)
   if (user.streakHistory.length)
      userStreak = user.streakHistory[user.streakHistory.length-1].streak

   if (daysDifference(lastDate,now)<=1){
      habit.history2.push({date: dateChecked,streak:lastStreak+1,punctuality: p})
      if (lastStreak+1>userStreak){
         user.streakHistory.push({date: dateChecked,streak: lastStreak+1,habitId: habit._id})
      }
   }
   else {
      habit.history2.push({date: dateChecked,streak: 1,punctuality: p})
   }

   console.log(dateChecked,habit.text,diff,habit.history2.length,p)

   if (user.punctualityHistory.length) {
      // const last = user.punctualityHistory[user.punctualityHistory.length-1]
      // daysDifference(removeTime(last.date),now)==0
      console.log("find length",user.punctualityHistory)
      const last = user.punctualityHistory.find(el=>daysDifference(removeTime(el.date),now)==0)
      if (last){//same day then update last record
         const avgP = (last.punctuality*last.changeCnt+p)/(last.changeCnt+1) //average update
         console.log("update avg",habit.text,last.punctuality,last.changeCnt,p,avgP)
         last.punctuality = Math.floor(avgP)
         last.changeCnt+=1
      }
      else {
         user.punctualityHistory.push({date: dateChecked,punctuality: p, changeCnt:1})
      }
   }
   else {
      console.log("init",now,habit.text)
      user.punctualityHistory.push({date: dateChecked,punctuality: p, changeCnt:1})
   }
}

function onRemoveCompleteToday(user,habit){
   const lastHistory = habit.streakHistory[habit.history2.length-1]
   const lastUserStreakHistory = user.streakHistory[user.streakHistory.length-1]
   const lastUserPunctualityHistory = user.lastPunctualityHistory[user.punctualityHistory.length-1]
   if (habit._id==lastUserStreakHistory.habitId){
      user.streakHistory.pop()
   }
   
   const  { changeCnt,punctuality } = lastUserPunctualityHistory
   lastUserPunctualityHistory.punctuality = Math.floor((punctuality*changeCnt - lastPunctualityHistory.punctuality )/(changeCnt-1))
   lastPunctualityHistory.changeCnt-=1
   if (lastPunctualityHistory.changeCnt==0){
      user.punctualityHistory.pop() //pop if zero
   }

   habit.streakHistory.pop()
   habit.punctualityHistory.pop()
}

async function recomputeUserStats(user) {
   const habits = await Habit.find({
      user: user._id,
   }).populate("history").sort("_id");
   for (let habit of habits) {
      habit.set('history2',undefined,{strict:false})
      // for (let hi of habit.history){
      //    onCompleteToday(user,habit,hi.date)
      // }
      await habit.save();
   }
   await user.save();
}

async function recompute() {
   const users = await User.find({});
   for (let user of users) {
      console.log(user);
      await recomputeUserStats(user);
   }
   console.log("completed")
}

mongoose
   .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
   })
   .then(() => {
      return recompute();
   })
   .then(()=>{
      return mongoose.connection.close()
   })
