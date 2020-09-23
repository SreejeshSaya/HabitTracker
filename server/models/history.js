const { model, Schema, Types } = require("mongoose");

const History = new Schema({
    date:{
        type:Date,
        default: ()=>new Date()
    }
})

module.exports = new model("history",History)