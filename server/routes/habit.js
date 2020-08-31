const {Router} = require("@awaitjs/express")
const {requireAuth} = require("../controllers/auth")
const habitControllers = require("../controllers/habit")

const router = Router()

router.postAsync("/add-habit",requireAuth,habitControllers.addHabit)
router.getAsync("/get-user-habits",requireAuth,habitControllers.getUserHabits)
router.postAsync("/delete-habit",requireAuth,habitControllers.deleteHabit)

module.exports = router
