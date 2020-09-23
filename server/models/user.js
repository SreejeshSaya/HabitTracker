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
});

module.exports = model("user", User);
