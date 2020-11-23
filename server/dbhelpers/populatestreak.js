const db = require("../utils/db");
const mongoose = require("mongoose");
const  {removeTime,daysDifference} = require('../utils/dateManager')
const Habit = require("../models/habit");
const User = require("../models/user");
const History = require("../models/history");
const { text } = require("body-parser");

async function recompute() {
    const users = await User.find({});
    const texts = []
    for (let user of users) {
    //    console.log(user);
    //    for (let s of user.streakHistory){
    //        console.log(s)
    //        const h = await Habit.findById(s.habitId)
    //        if (!h){
    //            s.habitText = texts[Math.floor(Math.random()*texts.length)]
    //            console.log("random")
    //        }
    //        else {
    //            texts.push(h.text)
    //            s.habitText = h.text
    //        }
    //    }
        user.punctualityHistory = user.punctualityHistory.filter(p=>{
            return p.punctuality>0
       })
       await user.save()
    }
    console.log("completed")
}
 
mongoose
    .connect(db, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       useCreateIndex: true,
       useFindAndModify: false,
    })
    .then(() => {
       return recompute();
    })
    .then(()=>{
       return mongoose.connection.close()
    })
