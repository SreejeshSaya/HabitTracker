const {Router} = require("@awaitjs/express")
const {requireAuth} = require("../controllers/auth")
const habitControllers = require("../controllers/habit")

const router = Router()

router.postAsync("/add-habit",requireAuth,habitControllers.addHabit)
router.postAsync("/update-habit",requireAuth,habitControllers.updateHabit)
router.getAsync("/get-user-habits",requireAuth,habitControllers.getUserHabits)
router.postAsync("/delete-habit",requireAuth,habitControllers.deleteHabit)
router.postAsync("/complete-habit-today",requireAuth,habitControllers.completeHabitToday)

module.exports = router
