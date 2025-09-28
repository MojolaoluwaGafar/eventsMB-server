const router = require("express").Router();
const {createEvent, getAttendingEvents,getHostingEvents,getPreviousEvents, getAllEvents, getSearchEvents } = require("../controllers/eventController");
const { upload } = require("../config/cloudinaryConfig")
const auth = require("../middleware/auth")

router.get("/all", getAllEvents);
router.get("/search", getSearchEvents);
router.post("/createEvent",auth, upload.single("photo"), createEvent)
router.get("/hosting/:userId", auth, getHostingEvents);
router.get("/attending/:userId", getAttendingEvents);
router.get("/previous/:userId", getPreviousEvents);

module.exports = router