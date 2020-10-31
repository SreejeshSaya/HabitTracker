import { max } from 'rxjs/operators';
import { removeTime, daysDifference } from './dateManager';



function average(arr: Array<number>) {
   if (arr.length == 0) return 0;
   return arr.reduce((a, b) => a + b) / arr.length;
}

function linearInterpolate(from: number, to: number, n: number) {
   if (n == 0) {
      return [];
   }
   if (n == 1) {
      return [from];
   }
   let slope = (to - from) / (n - 1);
   let arr = [];

   for (let i = 0; i < n; i++) {
      arr.push(from);
      from += slope;
   }
   return arr;
}

function getDateValues(points,endDate){
   const startDate = new Date(endDate.valueOf()-points.length*1000*60*60*24)
   return points.map((p,i)=>{
      const d = new Date(startDate.valueOf()+i*1000*60*60*24)
      return {date: d,value: p}
   })
}

export function makeStreakGraph(
   habit: any,
   history: Array<any>,
   maxDays: number = 90
) {
   // if (history.length == 0) {
   //    return [];
   // }
   // let now = removeTime(new Date());
   // let last = removeTime(history[history.length - 1].date);
   // let points = [];

   // //from last complete to today
   // let lastS = history[history.length - 1].streak;
   // let range = linearInterpolate(lastS, 0, daysDifference(last, now) + 1);
   // points = range.slice(1);

   // for (let i = history.length - 1; i >= 1; i--) {
   //    let prev = history[i - 1];
   //    let curr = history[i];
   //    let range = linearInterpolate(
   //       prev.streak,
   //       curr.streak,
   //       daysDifference(removeTime(prev.date), removeTime(curr.date)) + 1
   //    );
   //    points = [...range.slice(1), ...points];
   //    // console.log(range,daysDifference(removeTime(prev.date),removeTime(curr.date))+1,points,prev.date,curr.date)
   // }

   // let first = removeTime(history[0].date);
   // let created = removeTime(habit.createdAt);
   // // console.log(first,created)
   // if (first.valueOf() != created.valueOf()) {
   //    //if not completed on first day
   //    let range = linearInterpolate(
   //       0,
   //       history[0].streak,
   //       daysDifference(created, first) + 1
   //    );
   //    points = [...range, ...points];
   // } else {
   //    points = [history[0].streak, ...points];
   // }
   return history.map(h=>{
      return {
         date:removeTime(h.date),
         value: h.streak
      }
   })
}

export function makePunctualityGraph(
   habit: any,
   history: Array<any>,
   maxDays: number = 90
) {
   // if (history.length == 0) {
   //    return [];
   // }
   // let now = removeTime(new Date());
   // let last = removeTime(history[history.length - 1].date);
   // let points = [];
   // let avg = average(history.map((i) => i.punctuality));

   // //from last complete to today
   // let lastP = history[history.length - 1].punctuality;
   // let range = linearInterpolate(lastP, avg, daysDifference(last, now) + 1);
   // points = range.slice(1);

   // for (let i = history.length - 1; i >= 1; i--) {
   //    let prev = history[i - 1];
   //    let curr = history[i];
   //    let range = linearInterpolate(
   //       prev.punctuality,
   //       curr.punctuality,
   //       daysDifference(removeTime(prev.date), removeTime(curr.date)) + 1
   //    );
   //    points = [...range.slice(1), ...points];
   //    // console.log(range,daysDifference(removeTime(prev.date),removeTime(curr.date))+1,points,prev.date,curr.date)
   // }

   // let first = removeTime(history[0].date);
   // let created = removeTime(habit.createdAt);
   // // console.log(first,created)
   // if (first.valueOf() != created.valueOf()) {
   //    //if not completed on first day
   //    let range = linearInterpolate(
   //       0,
   //       history[0].punctuality,
   //       daysDifference(created, first) + 1
   //    );
   //    points = [...range, ...points];
   // } else {
   //    points = [history[0].punctuality, ...points];
   // }

   return history.map(h=>{
      return {
         date:removeTime(h.date),
         value: h.punctuality
      }
   })
}

