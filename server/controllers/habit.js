const Habit  = require("../models/habit")

exports.addHabit = async (req,res,next)=>{
    const userId = req.session.userId
    const text = req.body.text
    const habit =new Habit({
        user:userId,
        text:text
    })
    await habit.save()
    res.send(habit)
}

exports.getUserHabits = async (req,res,next)=>{
    const userId = req.session.userId
    const habits = await Habit.find({
        user: userId,
    })
    console.log(habits)

    res.send(habits)
}

exports.deleteHabit = async(req,res,next)=>{
    const habitId = req.body.habitId
    await Habit.findByIdAndDelete(habitId)
    res.send("Ok")
}
