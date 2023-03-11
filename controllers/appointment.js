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

const appointmentAdd = (req, res, next) => {
  try {
    const owner = ["", null, undefined].includes(req.body.owner)
      ? req.payload.id
      : req.body.owner;

    const newItem = Appointment({ ...req.body, owner });

    Appointment.create(newItem, (err, item) => {
      if (err) {
        console.error(err);

        return res.status(400).json({
          success: false,
          message: getErrorMessage(err),
        });
      } else {
        console.log(item);
        res.status(201).json(item);
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

const appointmentEdit = (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = ["", null, undefined].includes(req.body.owner)
      ? req.payload.id
      : req.body.owner;
    const updatedItem = { ...req.body, owner };
    console.log(updatedItem);

    Appointment.updateOne({ _id: id }, updatedItem, (err, result) => {
      if (err || result.modifiedCount === 0) {
        console.error(err);
        return res.status(400).json({
          success: false,
          message: err ? getErrorMessage(err) : "Item not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Item updated successfully",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

module.exports = {
  appointmentList,
  appointmentAdd,
  appointmentEdit,
};
