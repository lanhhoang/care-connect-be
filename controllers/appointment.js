const Appointment = require("../models/appointment");

const getErrorMessage = (err) => {
  console.error(err);
  let message = "";

  if (err.message) {
    message = err.message;
  }

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = "Date & Time is already booked";
        break;
      default:
        message = "Unknown server error";
    }
  }

  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) {
        message += `\n${err.errors[errName].message}`;
      }
    }
  }

  return message;
};

const apptList = async (req, res, next) => {
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

const apptAdd = (req, res, next) => {
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

const apptEdit = (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = ["", null, undefined].includes(req.body.owner)
      ? req.payload.id
      : req.body.owner;

    const updatedItem = { ...req.body, owner };

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

const apptCancel = (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedItem = { status: "cancelled" };

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
          message: "Appointment cancelled successfully",
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

const apptDelete = (req, res, next) => {
  try {
    const { id } = req.params;

    Appointment.findByIdAndRemove(
      { _id: id },
      { rawResult: true },
      (err, result) => {
        if (err || result.value === null) {
          console.error(err);

          return res.status(400).json({
            success: false,
            message: err ? getErrorMessage(err) : "Item not found",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Item deleted successfully",
          });
        }
      }
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

module.exports = {
  apptList,
  apptAdd,
  apptEdit,
  apptCancel,
  apptDelete,
};
