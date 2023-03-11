const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const { requireAuth, isAllowed } = require("../controllers/auth");
const {
  appointmentList,
  appointmentAdd,
  appointmentEdit,
  appointmentDelete,
} = require("../controllers/appointment");

/* GET list of tournaments */
router.get("/list", appointmentList);

/* POST create tournament */
router.post("/add", requireAuth, appointmentAdd);

/* PUT update tournament */
router.put("/edit/:id", requireAuth, isAllowed(Appointment), appointmentEdit);

/* DELETE delete tournament */
router.delete(
  "/delete/:id",
  requireAuth,
  isAllowed(Appointment),
  appointmentDelete
);

module.exports = router;
