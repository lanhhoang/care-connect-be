const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const { requireAuth, isAllowed } = require("../middlewares/auth");
const {
  apptList,
  apptAdd,
  apptEdit,
  apptDelete,
} = require("../controllers/appointment");

/* GET list of appointments */
router.get("/list", apptList);

/* POST create appointment */
router.post("/add", requireAuth, apptAdd);

/* PUT update appointment */
router.put("/edit/:id", requireAuth, isAllowed(Appointment), apptEdit);

/* DELETE delete appointment */
router.delete("/delete/:id", requireAuth, isAllowed(Appointment), apptDelete);

module.exports = router;
