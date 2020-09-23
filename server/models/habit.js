const { model, Schema, Types } = require("mongoose");

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
   history:[{
       ref:"history",
       type: Types.ObjectId,
       required:true
   }],
   color:{
       type: String,
       default:"maroon"
   },
   tags: [String],
   endDate:{
       type:Date,
       default: ()=>new Date(Date.now()+1000*60*60*24*30)
   },
   createdAt: {
       type:Date,
        default: ()=>new Date()
   }
});

module.exports = model("habit", Habit);
