const habitTrackerUsername = process.env.HABIT_TRACKER_USERNAME
const habitTrackerPassword = process.env.HABIT_TRACKER_PASSWORD
const dbUrl =  `mongodb+srv://${habitTrackerUsername}:${habitTrackerPassword}@cluster0.hljfv.gcp.mongodb.net/habit_tracker?retryWrites=true&w=majority`
console.log(dbUrl);
module.exports = dbUrl


