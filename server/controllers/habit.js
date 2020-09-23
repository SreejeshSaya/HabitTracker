const Habit = require("../models/habit");
const History = require("../models/history")
const { removeTime } = require("../utils/dateManager")

exports.addHabit = async (req, res, next) => {
   const userId = req.session.userId;
   const text = req.body.text;
   const color = req.body.color;
   let endDate = new Date(req.body.endDate);
   endDate =
      isNaN(endDate.getTime())
         ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
         : endDate;
   const habit = new Habit({
      user: userId,
      text: text,
      endDate: endDate,
      color
   });
   await habit.save();
   res.send(habit);
};

exports.updateHabit = async (req,res,next)=>{
    const habitId = req.body.habitId
    const habitText = req.body.text
    const habitColor = req.body.color
    const endDate = req.body.endDate
    const habit = await Habit.findById(habitId).populate("history")
    if (!habit){
        res.setHeader("Content-Type","text/plain")
        res.status(403).send("Habit not found")
    }
    else {
        if (habitText){
            habit.text = habitText
        }
        if (habitColor){
            habit.color = habitColor;
        }
        if (endDate && !isNaN(new Date(endDate))) {
            habit.endDate= endDate;
        }
        await habit.save();
        res.send(habit.populate());
    }
}

exports.getUserHabits = async (req, res, next) => {
   const userId = req.session.userId;
   const habits = await Habit.find({
      user: userId,
   }).populate("history");
   console.log(userId,habits);

   res.send(habits);
};

exports.deleteHabit = async (req, res, next) => {
   const habitId = req.body.habitId;
   await Habit.findByIdAndDelete(habitId);
   res.send("Ok");
};

exports.completeHabitToday = async (req, res, next) => {
    const habitId=  req.body.habitId
    const habit = await Habit.findById(habitId).populate("history")
    console.log("pops",habit)
    if (!habit){
        return res.status(403).send("Habit not found")
    }
    
    if ( habit.history[habit.history.length-1] ){
        let lastDate = new Date(habit.history[habit.history.length-1].date)
        console.log(lastDate,removeTime(lastDate))
        if (removeTime(lastDate)>=removeTime(new Date()))
            return res.status(403).send("Already completed today")
    }

    const history =new History()
    habit.history.push(history)
    await habit.save()
    await history.save()
    res.status(200).send(habit)

    
};
