// create a reference to the model
let MedicalHistory = require("../models/medicalList");

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
 * DISPLAYING MEDICAL LIST HISTORY
 * PROVIDING OWNER'S INFO AFTER LIST
 */
module.exports.medList = async function (req, res, next) {
  try {
    let medList = await MedicalHistory.find().populate({
      path: "owner",
      select: "firstName lastName email username admin created",
    });

    res.status(200).json(medList);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

/**
 * ADDING MEDICAL HISTORY ITEM
 * DEFINING OWNERSHIP OF ITEM
 */
module.exports.medAdd = (req, res, next) => {
  try {
    const owner = ["", null, undefined].includes(req.body.owner)
      ? req.payload.id
      : req.body.owner;

    const newItem = MedicalHistory({ ...req.body, owner });

    MedicalHistory.create(newItem, (err, item) => {
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

/**
 * EDITING EXISTING ITEM
 * ONLY OWNER OR ADMIN CAN EDIT
 */
module.exports.medEdit = (req, res, next) => {
try {
        const { id } = req.params;
        const owner = ["", null, undefined].includes(req.body.owner)
        ? req.payload.id
        : req.body.owner;
        const updatedItem = MedicalHistory({ ...req.body, owner });

        MedicalHistory.updateOne({ _id: id }, updatedItem, (err, result) => {
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
module.exports.medDelete = (req, res, next) => {
  try {
    const { id } = req.params;

    MedicalHistory.findByIdAndRemove(
      { _id: id },
      { rawResult: true },
      (err, result) => {
        if (err || result.value === null) {
          console.error(err);

          return res.status(400).json({
            success: false,
            message: err ? getErrorMessage(err) : "Item not found.",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Item deleted successfully.",
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