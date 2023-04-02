const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  signup,
  signin,
  userList,
  userProfile,
  userShow,
  userEdit,
} = require("../controllers/user");
const { requireAuth, requireAdmin } = require("../middlewares/auth");
const { paginate } = require("../middlewares/pagination");

const selectOptions = "firstName lastName email phoneNumber username role";

/* GET users listing. */
router.get(
  "/list",
  requireAuth,
  requireAdmin,
  paginate(User, selectOptions),
  userList
);

/* GET user profile. */
router.get("/me", requireAuth, userProfile);

/* GET user by ID. */
router.get("/show/:id", requireAuth, userShow);

router.post("/signup", signup);

router.post("/signin", signin);

/* PUT update user */
router.put("/edit/:id", requireAuth, userEdit);

module.exports = router;
