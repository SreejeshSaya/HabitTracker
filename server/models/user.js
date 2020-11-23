const { ObjectID } = require("mongodb");
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
   habitScore:{
       type: Number,
       default: 0
   },
   streakHistory:[
      {
         _id:false,
         habitId:ObjectID,
         date: Date,
         streak: Number,
         habitText:String
      }
   ],
   punctualityHistory:[
      {
         _id:false,
         date: Date,
         punctuality: Number,
         changeCnt:Number,
         prevPunctuality: Number
      }
   ],
   isFake:{
      type: Boolean,
      default: false
   }
});

module.exports = model("user", User);
