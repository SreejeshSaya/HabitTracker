const db = require("../utils/db");
const mongoose = require("mongoose");
const Habit = require("../models/habit");
const User = require("../models/user");
const History = require("../models/history");

const { removeTime,daysDifference } = require("../utils/dateManager");
const { off } = require("../models/user");

function getMaxStreak(history) {
   let streak = 0;
   let maxStreak = 0;
   let prev;
   for (let i = 0; i < history.length; i++) {
      const h = removeTime(history[i].date).valueOf();
      if (!prev) {
         prev = h;
         streak = 1;
      } else {
         if (h - prev == 1000 * 60 * 60 * 24) {
            streak += 1;
         }
      }
      if (streak > maxStreak) {
         maxStreak = streak;
      }
      prev = h;
   }
   return maxStreak;
}

//TODO Use startDate as well?
function getCompletionDetails(history){
   let score = 0;
   let prev;
   let average = 0;
   for (let {date} of history){
      date = removeTime(date)
      if (!prev){
         score+=5 //initialy for completing once add score
         average = 1
      }
      else {
         console.log(prev,date,daysDifference(prev,date))
         score+=5/daysDifference(prev,date)  // divide by no of days between completion (ideally it should be 1)
         average = average*0.5 + 0.5*daysDifference(prev,date) //moving average
      }
      prev = date
   }
   console.log("avg",average)
   return [score,average]
}

async function recomputeUserStats(user) {
   const habits = await Habit.find({
      user: user._id,
   }).populate("history");

   //reset all data
   user.habitScore = 0;
   user.bestStreak = 0;
   user.averageCompletionDelay = 1;

   for (let habit of habits) {
      [habit.completionScore,habit.averageCompletionDelay] = getCompletionDetails(habit.history)
      habit.maxStreak = getMaxStreak(habit.history);
      if (habit.maxStreak > user.bestStreak) {
         user.bestStreak = habit.maxStreak;
      }
      user.habitScore += habit.maxStreak + habit.completionScore;
      user.averageCompletionDelay = user.averageCompletionDelay*0.5 + habit.averageCompletionDelay*0.5

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
