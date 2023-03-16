const passport = require("passport");
const User = require("../models/user");

const getErrorMessage = (err) => {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  }
  if (err.message) {
    return err.message;
  } else {
    return "Unknown server error";
  }
};

// helper function for guard purposes
const requireAuth = (req, res, next) => {
  passport.authenticate(
    "tokencheck",
    { session: false },
    function (err, user, info) {
      if (err)
        return res.status(401).json({
          success: false,
          message: getErrorMessage(err),
        });
      if (info)
        return res.status(401).json({
          success: false,
          message: info.message,
        });

      req.payload = user;
      next();
    }
  )(req, res, next);
};

const requireAdmin = (req, res, next) => {
  console.log(req.payload.role);
  if (req.payload.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access Denied",
    });
  }
  next();
};

const requireEmployee = (req, res, next) => {
  console.log(req.payload.role);
  if (!["admin", "doctor", "nurse"].includes(req.payload.role)) {
    return res.status(403).json({
      success: false,
      message: "Access Denied",
    });
  }
  next();
};

// Validates the owner of the item.
const isAllowed = (model) => {
  return async (req, res, next) => {
    try {
      let id = req.params.id;
      let item = await model.findById(id).populate("owner");

      // If there is no item found.
      if (item == null) {
        throw new Error("Item not found."); // Express will catch this on its own.
      } else if (item.owner != null) {
        // If the item found has a owner.

        if (item.owner._id != req.payload.id) {
          // If the owner differs.

          let currentUser = await User.findOne({ _id: req.payload.id });

          if (!["admin", "doctor", "nurse"].includes(currentUser.role)) {
            // If the user is not a Admin

            console.log("====> Not authorized");
            return res.status(403).json({
              success: false,
              message: "User is not authorized to modify this item.",
            });
          }
        }
      }

      // If it reaches this point, runs the next middleware.
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireEmployee,
  isAllowed,
};
