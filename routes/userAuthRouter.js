const router= require("express").Router()
const { signUp, signIn, googleAuth, subscribe, forgotPassword, resetPassword } = require("../controllers/userAuthController")

router.post("/signup" , signUp)
router.post("/signin", signIn)
router.post("/subscribe", subscribe)
router.post("/forgot-password" , forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.post("/googleAuth", googleAuth)

module.exports = router