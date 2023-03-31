const { Schema, model } = require("mongoose");

const AppointmentSchema = Schema(
  {
    purpose: {
      type: String,
      required: "Purpose is required",
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "scheduled",
      enum: ["scheduled", "completed", "cancelled"],
    },
    scheduledAt: String,
  },
  {
    timestamps: true,
    collection: "appointment",
  }
);

module.exports = model("Appointment", AppointmentSchema);
