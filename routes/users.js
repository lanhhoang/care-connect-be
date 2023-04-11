const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  signup,
  signin,
  userList,
  userSearch,
  userProfile,
  userShow,
  userAdd,
  userEdit,
} = require("../controllers/user");
const {
  requireAuth,
  requireAdmin,
  requireEmployee,
} = require("../middlewares/auth");
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

/* GET list of users by search param */
router.get("/search", requireAuth, requireEmployee, userSearch);

/* GET user profile. */
router.get("/me", requireAuth, userProfile);

/* GET user by ID. */
router.get("/show/:id", requireAuth, userShow);

router.post("/signup", signup);

router.post("/signin", signin);

/* POST create user */
router.post("/add", requireAuth, requireAdmin, userAdd);

/* PUT update user */
router.put("/edit/:id", requireAuth, userEdit);

module.exports = router;
