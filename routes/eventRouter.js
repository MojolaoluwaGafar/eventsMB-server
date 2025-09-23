const router = require("express").Router();
const {createEvent} = require("../controllers/eventController");
const { upload } = require("../config/cloudinaryConfig")

router.post("/createEvent", upload.single("photo"), createEvent)

module.exports = router