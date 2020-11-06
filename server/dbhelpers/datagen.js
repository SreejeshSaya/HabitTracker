// 200 Users
// Choose User Create Date 3-6 month before now
// Choose Number of Habits  4 - 10
// For each habit
//    Choose start date, choose duration 1/2/3 month, which is before today
//    From that day to today 
//       if probability>0.5 then complete habit

const db = require("../utils/db");
const mongoose = require("mongoose");
const  {removeTime,daysDifference} = require('../utils/dateManager')
const Habit = require("../models/habit");
const User = require("../models/user");
const StatHistory = require("../models/stathistory");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const habit = require("../models/habit");

function onCompleteToday(user,habit,cDate){
   let lastDate=habit.createdAt,lastStreak=0,userStreak=0;
   if (habit.history.length) {
      lastDate= habit.history[habit.history.length-1].date
      lastStreak = habit.history[habit.history.length-1].streak
   }
   lastDate =  removeTime(lastDate)
   const now = removeTime(cDate)
   const startDate = removeTime(habit.createdAt)
   const diff= daysDifference(startDate,now)
   const p = (habit.history.length+1)/(diff+1)*100
   if (user.streakHistory.length)
      userStreak = user.streakHistory[user.streakHistory.length-1].streak

   if (daysDifference(lastDate,now)<=1){
      habit.history.push({date: cDate,streak:lastStreak+1,punctuality: p})
      if (lastStreak+1>userStreak){
         user.streakHistory.push({date: cDate,streak: lastStreak+1,habitId: habit._id})
      }
   }
   else {
      habit.history.push({date: cDate,streak: 1,punctuality: p})
   }

   if (user.punctualityHistory.length) {
      // const last = user.punctualityHistory[user.punctualityHistory.length-1]
      // daysDifference(removeTime(last.date),now)==0
      const last = user.punctualityHistory.find(el=>daysDifference(removeTime(el.date),now)==0)
      if (last){//same day then update last record
         const avgP = (last.punctuality*last.changeCnt+p)/(last.changeCnt+1) //average update
         last.punctuality = avgP
         last.changeCnt+=1
      }
      else {
         user.punctualityHistory.push({date: cDate,punctuality: p, changeCnt:1})
      }
   }
   else {
      user.punctualityHistory.push({date: cDate,punctuality: p, changeCnt:1})
   }
}

function randint(start,end){//both start end inclusive
   const diff = end-start
   return Math.ceil((Math.random()*diff))+start
}

const m = 1000*60*60*24*30
const d = 1000*60*60*24

const tags=  [
   'Excercise',
   'Coding',
   'Web Development',
   'C/C++',
   'Python',
   'Waking up',
   'Gym',
   'New hobby',
   'New game',
   'New sport',
   'Running',
   'New language'
]

function randTags(){
   const i = randint(0,tags.length-1)
   const j = randint(i+1,tags.length)
   return tags.slice(i,j)
}

function createUser(i){
   const username = 'anon'+i
   const email = 'anon'+i+'@habit-tracker.com'
   const password = bcrypt.hashSync(username,12)
   
   const c = randint(3,6) // atleast 3 months ago
   const createDate = new Date(Date.now()-m*c)
   return new User({
      username,email,password,
      createdAt:createDate,
      isFake:true
   })
}

function getStartEndDate(user){
   const ustart =user.createdAt.valueOf()
   const uend=  Date.now()
   const start = randint(ustart,uend-m*3) // atleast 3 months ago
   const end = randint(start+d,uend)
   return [new Date(start),new Date(end)]
}

function complexRandomBool(){
   let d = [Math.random()>0.5,Math.random()>0.25,Math.random()>0.75]
   return d[randint(0,2)]
}

function completeHabit(user,habits){
   let ustart = removeTime(user.createdAt).valueOf()
   let uend = removeTime(new Date()).valueOf()
   let curr = ustart
   while (curr<=uend){
      for (let h of habits){
         let hstart = removeTime(h.createdAt).valueOf()
         let hend = removeTime(h.endDate).valueOf()
         if (curr>=hstart && curr<=hend){
            let p = Math.random()
            if (complexRandomBool()){
               onCompleteToday(user,h,new Date(curr))
            }
         }
      }
      curr+=d
   }
}
function createHabit(user,i,j){
   const text= 'anon'+i+'-habit'+j
   const [startDate,endDate]= getStartEndDate(user)
   const habit = new Habit({
      user,text,createdAt:startDate,endDate:removeTime(endDate),isFake:true,
      tags:randTags()
   })
   
   return habit
}

async function makeData(num){
   let users = []
   let habits = []
   for (let i=0;i<num;i++){
      let nHabits = randint(4,10)
      let user = createUser(i)
      users.push(user)
      console.log("Created new User:",i)
      let uhabits = []
      for (let j=0;j<nHabits;j++){
         let habit = createHabit(user,i,j)
         uhabits.push(habit)
      }
      completeHabit(user,uhabits)
      habits = [...habits,...uhabits]
   }
   await User.insertMany(users)
   await Habit.insertMany(habits)
}
async function removeFake(){
   await User.deleteMany({
      isFake:true
   })

   await Habit.deleteMany({
      isFake:true
   })
}


mongoose
   .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
   })
   .then(() => {
      const t = process.argv[2]
      if (t=='rem'){
         console.log("rem")
         return removeFake()
      }
      else if (t=='add'){
         let num = +process.argv[3]
         if (isNaN(num)){
            return console.log("hoho haha")
         }
         console.log("add",num)
         return makeData(num)
      }
      else {
         console.log("hoho haha")
      }
      
      // 
   })
   .then(()=>{
      return mongoose.connection.close()
   })