const { Schema, model } = require("mongoose");
const statuses = require("../helpers/appointmentStatuses");

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
    scheduledAt: {
      type: String,
      unique: true,
      required: "Date & Time is required",
    },
    status: {
      type: String,
      default: statuses.scheduled,
      enum: Object.values(statuses),
    },
  },
  {
    timestamps: true,
    collection: "appointment",
  }
);

AppointmentSchema.index({ scheduledAt: 1 }, { unique: true });

module.exports = model("Appointment", AppointmentSchema);
