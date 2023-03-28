var express = require("express");
var router = express.Router();
const { requireAuth } = require("../middlewares/auth");

const {
  medList,
  medAdd,
  medEdit,
  medDelete,
} = require("../controllers/medical-record");

/* GET list of medical Record */
router.get("/list", requireAuth, medList);

/* POST create medical Record */
router.post("/add", requireAuth, medAdd);

/* PUT update medical Record */
router.put("/edit/:id", requireAuth, medEdit);

/* DELETE delete medical Record */
router.delete("/delete/:id", requireAuth, medDelete);

module.exports = router;
