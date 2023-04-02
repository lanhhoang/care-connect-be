// create a reference to the model
const MedicalRecord = require("../models/medical-record");
const User = require("../models/user");

function getErrorMessage(err) {
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
}

/**
 * DISPLAYING MEDICAL RECORD - LIST
 * PROVIDING OWNER'S INFO AFTER LISTING
 */
const medList = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const query = userId ? { owner: userId } : {};

    const merds = await MedicalRecord.find(query).populate({
      path: "owner",
      select: "firstName lastName email phoneNumber",
    });

    res.status(200).json(merds);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

const medSearch = async (req, res, next) => {
  try {
    const { email, phoneNumber } = req.query;
    const query = email ? { email: email } : { phoneNumber: phoneNumber };

    const owner = await User.findOne(query).populate({
      path: "medicalRecords",
    });

    let merds = [];

    if (owner && owner._id) {
      merds = await MedicalRecord.find({
        owner: owner._id,
      }).populate({
        path: "owner",
        select: "firstName lastName email phoneNumber",
      });
    }

    res.status(200).json(merds);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

/**
 * ADDING MEDICAL RECORD ITEM
 * DEFINING OWNERSHIP OF ITEM
 */
const medAdd = async (req, res, next) => {
  try {
    const owner = ["", null, undefined].includes(req.body.owner)
      ? req.payload.id
      : req.body.owner;

    const newItem = MedicalRecord({ ...req.body, owner });

    MedicalRecord.create(newItem, async (err, item) => {
      if (err) {
        console.error(err);

        return res.status(400).json({
          success: false,
          message: getErrorMessage(err),
        });
      }

      await User.findByIdAndUpdate(owner._id, {
        $push: { medicalRecords: item },
      });

      res.status(201).json(item);
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

/**
 * EDITING EXISTING ITEM
 * ONLY OWNER OR ADMIN CAN EDIT
 */
const medEdit = (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = ["", null, undefined].includes(req.body.owner)
      ? req.payload.id
      : req.body.owner;
    const updatedItem = MedicalRecord({ ...req.body, owner });

    MedicalRecord.updateOne({ _id: id }, updatedItem, (err, result) => {
      console.log("id " + id);

      if (err || result.modifiedCount === 0) {
        return res.status(400).json({
          success: false,
          message: err ? getErrorMessage(err) : "Item not found.",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Item updated successfully.",
        });
        console.log("UPDATED ITEMS" + updatedItem);
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

/**
 * DELETE EXISTING ITEM
 * ONLY OWNER OR ADMIN CAN DELETE
 */
const medDelete = (req, res, next) => {
  try {
    const { id } = req.params;

    MedicalRecord.findByIdAndDelete(
      { _id: id },
      { rawResult: true },
      (err, result) => {
        if (err || result.value === null) {
          console.error(err);

          return res.status(400).json({
            success: false,
            message: err ? getErrorMessage(err) : "Item not found.",
          });
        }

        res.status(200).json({
          success: true,
          message: "Item deleted successfully.",
        });
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
  medList,
  medSearch,
  medAdd,
  medEdit,
  medDelete,
};
