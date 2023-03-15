

let mongoose = require("mongoose");

// Create Medical Record schema
let MedicalRecordSchema = mongoose.Schema(
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
    collection: "medicalRecord",
  }
);

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema);
