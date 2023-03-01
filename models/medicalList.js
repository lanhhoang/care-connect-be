

let mongoose = require("mongoose");

// Create MedicalList schema
let MedicalListSchema = mongoose.Schema(
  {
    findings:String,
    medicine: String,
    // adds relationship with USER
    // use Model ID = User
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recordedDate: String,
    doctorName: {
        type: String,
        required: "Name is required",
    },
  },
  {
    collection: "medicalList",
  }
);

module.exports = mongoose.model("MedicalList", MedicalListSchema);
