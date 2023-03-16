const { Schema, model } = require("mongoose");

// Create Medical Record schema
const MedicalRecordSchema = Schema(
  {
    findings: String,
    medicine: String,
    // adds relationship with USER
    // use Model ID = User
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    doctorName: {
      type: String,
      required: "Name is required",
    },
    recordedDate: String,
  },
  {
    timestamps: true,
    collection: "medicalRecord",
  }
);

module.exports = model("MedicalRecord", MedicalRecordSchema);
