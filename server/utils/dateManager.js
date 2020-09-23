

exports.habitEnded = (date)=>{
   return removeTime(new Date())>removeTime(date)
}

exports.removeTime = (date)=>{
   return new Date(date.toDateString())
}