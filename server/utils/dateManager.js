
const removeTime = (date) => {
    return new Date(date.toDateString());
      date.toU
};


exports.habitEnded = (date) => {
    return removeTime(new Date()) > removeTime(date);
};
 
exports.daysDifference = (d1,d2)=>{
   return Math.floor((d2-d1)/(1000*60*60*24))
}

exports.getMaxStreak = (history) => {
   let streak = 0;
   let maxStreak = 0;
   let prev;
   for (let i = 0; i < history.length; i++) {
      const h = removeTime(history[i].date).valueOf();
      if (!prev) {
         prev = h;
         streak = 1;
      } else {
         if (h - prev == 1000 * 60 * 60 * 24) {
            streak += 1;
         }
      }
      if (streak > maxStreak) {
         maxStreak = streak;
      }
      prev = h;
   }
   return maxStreak;
};

exports.getCurrentStreak = (history) => {
   let streak = 0;
   let prev = removeTime(new Date()).valueOf();
   for (let i = history.length - 1; i >= 0; i--) {
      const h = removeTime(history[i].date).valueOf();
      if (h != prev) {
         return streak;
      } else {
         prev = prev - 1000 * 60 * 60 * 24;
         streak += 1;
      }
   }
   return streak;
};

exports.removeTime = removeTime
