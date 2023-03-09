const express = require("express");
const router = express.Router();
const { appointmentList } = require("../controllers/appointment");

router.get("/list", appointmentList);

module.exports = router;
