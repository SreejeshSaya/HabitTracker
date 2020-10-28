const { model, Schema } = require("mongoose");

const User = new Schema({
   username: {
      type: String,
      required: true,
   },
   password: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
   age: Number,
   createdAt: {
      type: Date,
      default: ()=>new Date(),
   },
   profileImageUrl:{
      type: String,
      default: 'https://www.eurogeosurveys.org/wp-content/uploads/2014/02/default_profile_pic.jpg'
   },
   bestStreak:{
       type: Number,
       default: 0
   },
   habitScore:{
       type: Number,
       default: 0
   },
   averageCompletionDelay: {
      type: Number,
      default: 1
   }
});

module.exports = model("user", User);
