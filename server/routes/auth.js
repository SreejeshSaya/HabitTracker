const {Router} = require("@awaitjs/express")

const router = Router()
const authControllers = require("../controllers/auth")

// TODO Validation
// TODO Error Handling
// TODO Use PassportJS for authentication

router.getAsync("/is-logged-in",authControllers.isLoggedIn)
router.getAsync("/get-user-details",authControllers.requireAuth,authControllers.getUserDetails)
router.postAsync("/update-user-details",authControllers.requireAuth,authControllers.updateUserDetails)
router.postAsync("/signup",authControllers.signup)
router.postAsync("/login",authControllers.login)
router.postAsync("/logout",authControllers.logout)

module.exports = router
