const router = require("express").Router();
const {createEvent, getUpcomingEvents,getNearbyEvents, getAttendingEvents,getHostingEvents,getPreviousEvents, getAllEvents, getSearchEvents } = require("../controllers/eventController");
const { upload } = require("../config/cloudinaryConfig")
const auth = require("../middleware/auth")

router.post("/createEvent",auth, upload.single("photo"), createEvent)
router.get("/all", getAllEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/nearby", getNearbyEvents);
router.get("/search", getSearchEvents);
router.get("/hosting/:userId", auth, getHostingEvents);
router.get("/attending/:userId", getAttendingEvents);
router.get("/previous/:userId", getPreviousEvents);

module.exports = router