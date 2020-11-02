const { model, Schema, Types, Model } = require("mongoose");

const StatHistory = new Schema({
   avgLengthHabit:[Number],
   avgPunctualityUser:[Number],
   totalhabitsCreated:Number,
   updatedAt:Date
})

module.exports =model("stathistory",StatHistory)

