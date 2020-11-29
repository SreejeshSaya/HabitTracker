const {removeTime,daysDifference} = require('../utils/dateManager')



exports.onCompleteToday =function(user,habit){
   let lastDate=habit.createdAt,lastStreak=0,userStreak=0;
   if (habit.history.length) {
      lastDate= habit.history[habit.history.length-1].date
      lastStreak = habit.history[habit.history.length-1].streak
   }
   lastDate =  removeTime(lastDate)
   const now = removeTime(new Date())
   const startDate = removeTime(habit.createdAt)
   const diff= daysDifference(startDate,now)
   const p = (habit.history.length+1)/(diff+1)*100
   if (user.streakHistory.length)
      userStreak = user.streakHistory[user.streakHistory.length-1].streak

   if (daysDifference(lastDate,now)<=1){
      habit.history.push({date: new Date(),streak:lastStreak+1,punctuality: p})
      if (lastStreak+1>userStreak){
         user.streakHistory.push({date: new Date(),streak: lastStreak+1,habitId: habit._id,habitText:habit.text})
      }
      user.habitScore+=lastStreak+1
   }
   else {
        habit.history.push({date: new Date(),streak: 1,punctuality: p})
        user.habitScore+=1
   }

   console.log(new Date(),habit.text,diff,habit.history.length,p)

   if (user.punctualityHistory.length) {
      // const last = user.punctualityHistory[user.punctualityHistory.length-1]
      // daysDifference(removeTime(last.date),now)==0
      console.log("find length",user.punctualityHistory)
      const last = user.punctualityHistory.find(el=>daysDifference(removeTime(el.date),now)==0)
      if (last){//same day then update last record
         const avgP = (last.punctuality*last.changeCnt+p)/(last.changeCnt+1) //average update
         console.log("update avg",habit.text,last.punctuality,last.changeCnt,p,avgP)
         last.punctuality = avgP
         last.changeCnt+=1
      }
      else {
         user.punctualityHistory.push({date: new Date(),punctuality: p, changeCnt:1})
      }
   }
   else {
      console.log("init",now,habit.text)
      user.punctualityHistory.push({date: new Date(),punctuality: p, changeCnt:1})
   }
}

exports.onRemoveCompleteToday=function(user,habit){
   const lastHistory = habit.history[habit.history.length-1]
   const lastUserStreakHistory = user.streakHistory[user.streakHistory.length-1]
   const lastUserPunctualityHistory = user.punctualityHistory[user.punctualityHistory.length-1]
   if (habit._id==lastUserStreakHistory.habitId){
      user.streakHistory.pop()
   }
   
   const  { changeCnt,punctuality } = lastUserPunctualityHistory
   lastUserPunctualityHistory.punctuality = (punctuality*changeCnt - lastHistory.punctuality )/(changeCnt-1)
   lastUserPunctualityHistory.changeCnt-=1
   if (lastUserPunctualityHistory.changeCnt==0){
      user.punctualityHistory.pop() //pop if zero
   }
   user.habitScore-=lastHistory.streak
   habit.history.pop()

}

   
   