const { model, Schema, Types } = require("mongoose");
const { removeTime, getMaxStreak, daysDifference } = require("../utils/dateManager");
const User = require("./user");

const Habit = new Schema({
   user: {
      ref: "user",
      type: Types.ObjectId,
      required: true,
   },
   text: {
      type: String,
      required: true,
   },
   history: [
      {
         ref: "history",
         type: Types.ObjectId,
         required: true,
      },
   ],
   color: {
      type: String,
      default: "maroon",
   },
   tags: [String],
   endDate: {
      type: Date,
      default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
   },
   createdAt: {
      type: Date,
      default: () => new Date(),
   },
   maxStreak: {
      type: Number,
      default: 0,
   },
   completionScore: {
      type: Number,
      default: 0
   },
   averageCompletionDelay: {
      type: Number,
      default: 0
   }
});

Habit.methods.updateMax = async function (user) {
   // The streak will be atleast once since this function is called only when users presses complete habit
   let streak = 1;

   //Find the current streak at the time when users presses complete habit today
   //if this current streak is greater than the max then update the maxStreak as well
   let i = this.history.length - 1;
   while (i) {
      let now = removeTime(this.history[i].date);
      let prev = removeTime(this.history[i-1].date);
      if (now - prev != 1000 * 60 * 60 * 24) {
         //stop when the difference between previous and current isnt one
         break;
      } else {
         streak += 1;
      }
      i--;
   }

   //increment the score of the user if streak has increased
   //this will be newscore-oldscore since score is computed as the sum of best streaks of habits
   if (streak > this.maxStreak) {
      console.log("Updating streak")
      user.habitScore = streak - this.maxStreak
      this.maxStreak = streak;
   }
};

Habit.methods.removeCompleteToday = async function(user){
   user.averageCompletionDelay = (user.averageCompletionDelay - 0.5*this.averageCompletionDelay)/0.5
   user.habitScore-=5/this.averageCompletionDelay

   if (this.history.length>=2){
      let a = removeTime(this.history[this.history.length-1].date)
      let b = removeTime(this.history[this.history.length-2].date)
      console.log(b,a,daysDifference(b,a))
      this.completionScore-=5/daysDifference(b,a)
      this.averageCompletionDelay = ( this.averageCompletionDelay - 0.5*daysDifference(b,a))/0.5 //equation a2 = 0.5*a1 + 0.5/daysDiff, need to get a1 (can be improved?)
   }
   else {
      this.completionScore-=5
      this.averageCompletionDelay-=1
   }

   let currMax = this.maxStreak
   console.log(this.history)
   this.history.pop()
   console.log(this.history)

   user.averageCompletionDelay = user.averageCompletionDelay*0.5 + 0.5*this.averageCompletionDelay
   user.habitScore+=5/this.averageCompletionDelay

   this.maxStreak = getMaxStreak(this.history)
   if (currMax>this.maxStreak){
      user.habitScore = this.maxStreak-currMax
   }
}

Habit.methods.updateCompletionDetails = function(user){
   user.averageCompletionDelay = (user.averageCompletionDelay - 0.5*this.averageCompletionDelay)/0.5
   user.habitScore-=5/this.averageCompletionDelay

   let history = this.history
   console.log(history)
   if (history.length>=2){
      let a = removeTime(history[history.length-1].date)
      let b = removeTime(history[history.length-2].date)
      this.completionScore+=5/daysDifference(b,a)
      this.averageCompletionDelay = this.averageCompletionDelay*0.5 + 0.5*daysDifference(b,a)

   }
   else {
      this.completionScore+=5
      this.averageCompletionDelay+=1
   }
   user.averageCompletionDelay = 0.5*user.averageCompletionDelay + 0.5*this.averageCompletionDelay
   user.habitScore+=5/this.averageCompletionDelay
}

module.exports = model("habit", Habit);
