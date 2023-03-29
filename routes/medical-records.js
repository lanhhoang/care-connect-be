var express = require("express");
var router = express.Router();
const { requireAuth, requireEmployee } = require("../middlewares/auth");

const {
  medList,
  medSearch,
  medAdd,
  medEdit,
  medDelete,
} = require("../controllers/medical-record");

/* GET list of medical Record */
router.get("/list", requireAuth, medList);

/* GET list of medical Record by search param */
router.get("/search", requireAuth, requireEmployee, medSearch);

/* POST create medical Record */
router.post("/add", requireAuth, medAdd);

/* PUT update medical Record */
router.put("/edit/:id", requireAuth, medEdit);

/* DELETE delete medical Record */
router.delete("/delete/:id", requireAuth, medDelete);

module.exports = router;
