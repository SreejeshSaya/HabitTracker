const { Router } = require("@awaitjs/express");
const { uploadHandler } = require("../controllers/firebase-sync");

const router = Router();
const authControllers = require("../controllers/auth");

// TODO Validation
// TODO Error Handling
// TODO Use PassportJS for authentication

router.getAsync("/is-logged-in", authControllers.isLoggedIn);

router.getAsync(
   "/get-user-details",
   authControllers.requireAuth,
   authControllers.getUserDetails
);

router.postAsync(
   "/update-user-details",
   authControllers.requireAuth,
   authControllers.updateUserDetails
);

router.postAsync(
   "/update-password",
   authControllers.requireAuth,
   authControllers.updatePassword
);

router.postAsync(
   "/signup",
   authControllers.usernameValidation,
   authControllers.emailValidation,
   authControllers.signup
);

router.postAsync(
   "/login",
   authControllers.loginValidation,
   authControllers.login
);

router.postAsync(
   "/logout",
   authControllers.requireAuth,
   authControllers.logout
);

router.postAsync("/upload-image", authControllers.requireAuth, uploadHandler);

module.exports = router;
