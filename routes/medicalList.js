var express = require("express");
var router = express.Router();
let authController = require("../controllers/auth");

let medHisController = require("../controllers/medicalList");

/* GET list of medical History */
router.get("/list", medHisController.medList);

/* POST create medical History */
router.post("/add", authController.requireAuth, medHisController.medAdd);

/* PUT update medical History */
router.put("/edit/:id", authController.requireAuth, medHisController.medEdit);

// /* DELETE delete medical History */
router.delete("/delete/:id", authController.requireAuth, medHisController.medDelete);

module.exports = router;
