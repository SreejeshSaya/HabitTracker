const { model, Schema, Types, Model } = require("mongoose");

const Sample = new Schema({
    samples:Schema.Types.Mixed
})

module.exports =model("sample",Sample)

