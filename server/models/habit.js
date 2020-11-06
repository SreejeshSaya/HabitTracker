const { ObjectID } = require("mongodb");
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
   history:[
      {
         _id:false,
         date: Date,
         streak: Number,
         punctuality: Number
      }
   ],
   isFake:{
      type:Boolean,
      default:false
   }
});

Habit.methods.getLastCompletedDate=function(){
   const last = this.history[this.history.length-1]
   if (last){
      return removeTime(last.date)
   }
   return undefined
}


module.exports = model("habit", Habit);
