const router = require("express").Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const auth =require("../middleware/auth")

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/dummy",auth,(req,res)=>{
  res.send("create event")
})

module.exports = router; 
