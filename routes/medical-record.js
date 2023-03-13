var express = require("express");
var router = express.Router();
let authController = require("../controllers/auth");

let medHisController = require("../controllers/medical-record");

/* GET list of medical Record */
router.get("/list", medHisController.medList);

/* POST create medical Record */
router.post("/add", authController.requireAuth, medHisController.medAdd);

/* PUT update medical Record */
router.put("/edit/:id", authController.requireAuth, medHisController.medEdit);

// /* DELETE delete medical Record */
router.delete("/delete/:id", authController.requireAuth, medHisController.medDelete);

module.exports = router;
