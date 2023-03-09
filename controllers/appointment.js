const Appointment = require("../models/appointment");

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

const appointmentList = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().populate({
      path: "owner",
      select: "firstName lastName email phoneNumber username role",
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

module.exports = {
  appointmentList,
};
