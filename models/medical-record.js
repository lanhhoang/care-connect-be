const { Schema, model } = require("mongoose");

// Create Medical Record schema
const MedicalRecordSchema = Schema(
  {
    diagnostic: String,
    medicine: String,
    // adds relationship with USER
    // use Model ID = User
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "medicalRecord",
  }
);

module.exports = model("MedicalRecord", MedicalRecordSchema);
