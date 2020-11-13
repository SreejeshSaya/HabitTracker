const { model, Schema, Types, Model } = require("mongoose");

const StatHistory = new Schema({
   avgLengthHabit:[Number],
   avgPunctualityUser:[Number],
   totalhabitsCreated:Number,
   updatedAt:Date,
   tagFrequency:Schema.Types.Mixed
})

module.exports =model("stathistory",StatHistory)

