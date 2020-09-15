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
   tags: [String],
});

module.exports = model("habit", Habit);
