import { NodeWithI18n } from '@angular/compiler';

export function habitEnded(date: Date) {
   return removeTime(new Date()) > removeTime(date);
}

export function removeTime(date: Date): Date {
   return new Date(date.toDateString());
}

export function getStreak(history) {
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
}

export function getMaxStreak(history) {
   let streak = 0;
   let maxStreak = 0;
   let prev;
   for (let i = 0; i < history.length; i++) {
      const h = removeTime(history[i].date).valueOf();
      if (!prev){
         prev = h
         streak = 1
      }
      else {
         if ((h-prev)==1000 * 60 * 60 * 24){
            streak+=1
         }
      }
      if (streak>maxStreak){
         maxStreak = streak
      }
      prev = h
   }
   return maxStreak;
}

export function datesEqual(d1, d2) {
   return d1.valueOf() == d2.valueOf();
}

export function getDateString(GMTString) {
   const date = new Date(GMTString).toISOString();
   return date.substr(0, date.indexOf('T'));
}

export function getHistory(startDate, history) {
   const timeRange = [];
   let curr = removeTime(startDate).valueOf();
   const now = removeTime(new Date()).valueOf();
   const historyDate = history.map(({ date }) => removeTime(date).valueOf());
   let i = 0;
   while (curr <= now) {
      let found = false;
      while (i < history.length) {
         if (historyDate[i] == curr) {
            found = true;
            break;
         } else if (historyDate[i] > curr) {
            break;
         }
         i += 1;
      }
      if (found) {
         timeRange.push({
            date: new Date(curr),
            completed: true,
            dateTime: history[i].date,
         });
      } else {
         timeRange.push({ date: new Date(curr), completed: false });
      }
      curr += 1000 * 60 * 60 * 24;
   }
   // console.log(timeRange)
   return timeRange
}

export function daysDifference(d1: Date,d2: Date){
   return Math.floor((d2.valueOf()-d1.valueOf())/(1000*60*60*24))
}




