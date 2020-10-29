const { model, Schema, Types } = require("mongoose");

const History = new Schema({
    date:{
        type:Date,
        default: ()=>new Date()
    },
    streak:{
      type: Number,
      default: 0
    },
    punctuality:{
       type: Number,
       default: 0
    }
})

module.exports = new model("history",History)