const { Schema, model } = require("mongoose");

const AppointmentSchema = Schema(
  {
    name: {
      type: String,
      required: "Name is required",
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    scheduledAt: String,
    status: {
      type: String,
      default: "scheduled",
      enum: ["scheduled", "completed", "cancelled"],
    },
  },
  {
    timestamps: true,
    collection: "appointment",
  }
);

module.exports = model("Appointment", AppointmentSchema);
