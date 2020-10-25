const db = require("../utils/db");
const mongoose = require("mongoose");
const Habit = require("../models/habit");
const User = require("../models/user");
const History = require("../models/history");

const { removeTime } = require("../utils/dateManager");

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

async function recomputeUserStats(user) {
   const habits = await Habit.find({
      user: user._id,
   }).populate("history");

   //reset all data
   user.habitScore = 0;
   user.bestStreak = 0;

   for (let habit of habits) {
      habit.maxStreak = getMaxStreak(habit.history);
      if (habit.maxStreak > user.bestStreak) {
         user.bestStreak = habit.maxStreak;
      }
      user.habitScore += habit.maxStreak;
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
