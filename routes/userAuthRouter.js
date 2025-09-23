const router= require("express").Router()
const { signUp, signIn, subscribe, forgotPassword, resetPassword } = require("../controllers/userAuthController")

router.post("/signup" , signUp)
router.post("/signin", signIn)
router.post("/subscribe", subscribe)
router.post("/forgot-password" , forgotPassword)
router.post("/reset-password/:token", resetPassword)


module.exports = router