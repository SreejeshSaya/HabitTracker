const {Router} = require("@awaitjs/express")
const {requireAuth} = require("../controllers/auth")
const habitControllers = require("../controllers/habit")
const habit = require("../models/habit")

const router = Router()


// requireAuth for all http methods. Just use router.use?
router.postAsync("/add-habit",requireAuth,habitControllers.addHabit)
router.postAsync("/update-habit",requireAuth,habitControllers.updateHabit)
router.getAsync("/get-user-habits",requireAuth,habitControllers.getUserHabits)
router.postAsync("/delete-habit",requireAuth,habitControllers.deleteHabit)
router.postAsync("/complete-habit-today",requireAuth,habitControllers.completeHabitToday)
router.postAsync("/remove-complete-today",requireAuth,habitControllers.removeCompleteToday)

router.getAsync("/user-public-data",habitControllers.getUserPublicData)
router.getAsync("/leaderboard",habitControllers.getLeaderBoard)

router.getAsync("/public-stats",habitControllers.getPublicStats)

router.getAsync("/recommend-tags",requireAuth,habitControllers.getRecommendedTags)

router.getAsync("/get-samples",requireAuth,habitControllers.getSamples)

router.postAsync("/update-bulk",requireAuth,habitControllers.completeUpdates)

module.exports = router
