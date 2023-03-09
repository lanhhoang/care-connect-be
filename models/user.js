const { Schema, model } = require("mongoose");
const crypto = require("crypto");
const roles = require("../helpers/roles");

const UserSchema = Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid e-mail address"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      match: [/^\d{3}-\d{3}-\d{4}$/, "Please fill a valid phone number"],
    },
    username: {
      type: String,
      unique: true,
      required: "Username is required",
      trim: true,
    },
    role: {
      type: String,
      default: roles.patient,
      enum: Object.values(roles),
    },
    password: {
      type: String,
      validate: [
        (password) => {
          return password && password.length > 6;
        },
        "Password should be longer",
      ],
    },
    salt: {
      type: String,
    },
    provider: {
      type: String,
      required: "Provider is required",
    },
    providerId: String,
    providerData: {},
  },
  {
    timestamps: true,
    collection: "user",
  }
);

UserSchema.virtual("fullName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (fullName) {
    let splitName = fullName.split(" ");
    this.firstName = splitName[0] || "";
    this.lastName = splitName[1] || "";
  });

UserSchema.pre("save", function (next) {
  if (this.password) {
    this.salt = Buffer.from(
      crypto.randomBytes(16).toString("base64"),
      "base64"
    );
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.hashPassword = function (password) {
  return crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("base64");
};

UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var possibleUsername = username + (suffix || "");
  this.findOne(
    {
      username: possibleUsername,
    },
    (err, user) => {
      if (!err) {
        if (!user) {
          callback(possibleUsername);
        } else {
          return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
        }
      } else {
        callback(null);
      }
    }
  );
};

UserSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

module.exports = model("User", UserSchema);
