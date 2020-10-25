const { model, Schema, Types } = require("mongoose");
const { removeTime } = require("../utils/dateManager");
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
});

Habit.methods.updateMax = async function () {
   // The streak will be atleast once sinc this function is called only when users presses complete habit
   let streak = 1;

   //Find the current streak at the time when users presses complete habit today
   //if this current streak is greater than the max then update the maxStreak as well
   let i = this.history.length - 1;
   while (i) {
      let now = removeTime(this.history[i].date);
      let prev = removeTime(this.history[i].date);
      if (now - prev != 1000 * 60 * 60 * 24) {
         //stop when the difference between previous and current isnt one
         break;
      } else {
         streak += 1;
      }
   }

   //increment the score of the user if streak has increased
   //this will be newscore-oldscore since score is computed as the sum of best streaks of habits
   if (streak > this.maxStreak) {
      console.log("Updating streak")
      await User.findOneAndUpdate(
         {
            _id: this.user,
         },
         {
            $inc: { habitScore: streak - this.maxStreak },
         }
      );
      this.maxStreak = streak;
   }
};

module.exports = model("habit", Habit);
