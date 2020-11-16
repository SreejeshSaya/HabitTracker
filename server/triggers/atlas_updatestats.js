
const removeTime = (date) => {
    return new Date(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())
 };
 
 const daysDifference = (d1, d2) => {
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
 };
 
 exports = async function () {
    /*
       A Scheduled Trigger will always call a function without arguments.
       Documentation on Triggers: https://docs.mongodb.com/realm/triggers/overview/
 
       Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.
 
       Access a mongodb service:
       const collection = context.services.get(<SERVICE_NAME>).db("db_name").collection("coll_name");
       const doc = collection.findOne({ name: "mongodb" });
 
       Note: In Atlas Triggers, the service name is defaulted to the cluster name.
 
       Call other named functions if they are defined in your application:
       const result = context.functions.execute("function_name", arg1, arg2);
 
       Access the default http client and execute a GET request:
       const response = context.http.get({ url: <URL> })
 
       Learn more about http client here: https://docs.mongodb.com/realm/functions/context/#context-http
    */
 
    const Habit = context.services.get("Cluster0").db("habit_tracker").collection("habits");
    const User = context.services.get("Cluster0").db("habit_tracker").collection("users");
    const StatHistory = context.services.get("Cluster0").db("habit_tracker").collection("stathistories");
 
    const lastDate = new Date(removeTime(new Date()) - 90 * 1000 * 60 * 60 * 24);
 
    const habits = await Habit.find({
       createdAt: {
          $gte: lastDate,
       },
    }).limit(100).toArray();
 
    let avgLength = habits
       .map((h) => {
          return daysDifference(removeTime(new Date(h.createdAt)), removeTime(new Date(h.endDate)));
       })
       .filter((a) => a > 0) //some invalid habits are present in db (enddate<createdate) will remove them later
       .sort((a, b) => a - b);
 
    const users = await User.find({
       punctualityHistory: {
          $elemMatch: {
             //atleast one puncutality updated after the last date
             date: {
                $gte: lastDate,
             },
          },
       },
    }).limit(100).toArray();
 
    let avgPunctuality = users
       .map((u) => {
          const recentP = u.punctualityHistory.filter((p) => new Date(p.date) >= lastDate).map((p) => p.punctuality);
          return recentP.reduce((p1, p2) => p1 + p2) / recentP.length; //average of punctuality in last 14 days
       })
       .sort((a, b) => a - b);
    
       const userTags = habits.reduce((agg,h)=>{
        for (let t of h.tags){
            agg[t]  = (agg[t] || 0) + 1
        }
        return agg
    },{})
    
    const freq = Object.keys(userTags).map(k=>[k,userTags[k]])

    freq.sort((t1,t2)=>{
        return t2[1]-t1[1]
    })

    await StatHistory.updateOne(
       {},
       {
          $set: {
             avgLengthHabit: avgLength,
             avgPunctualityUser: avgPunctuality,
             totalhabitsCreated: avgLength.length,
             updatedAt: new Date(),
             tagFrequency:freq
          },
       }
    );

    
    

    
 };