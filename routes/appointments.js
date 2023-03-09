const express = require("express");
const router = express.Router();
const { appointmentList } = require("../controllers/appointment");

/* GET list of tournaments */
router.get("/list", appointmentList);

module.exports = router;
