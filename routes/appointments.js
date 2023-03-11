const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const { requireAuth, isAllowed } = require("../controllers/auth");
const {
  appointmentList,
  appointmentAdd,
} = require("../controllers/appointment");

/* GET list of tournaments */
router.get("/list", appointmentList);

/* POST create tournament */
router.post("/add", requireAuth, appointmentAdd);

module.exports = router;
