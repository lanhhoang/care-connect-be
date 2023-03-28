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

const paginate = (model, selectOptions) => {
  return async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await model.countDocuments();
      const totalPage = Math.ceil(total / limit);

      const result = {
        page,
        limit,
        totalPage,
      };

      if (endIndex < total) {
        result.nextPage = page + 1;
      }

      if (startIndex > 0) {
        result.prevPage = page - 1;
      }

      result.data = await model
        .find({})
        .skip(startIndex)
        .limit(limit)
        .select(selectOptions);

      res.paginatedResult = result;
      next();
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  };
};

module.exports = {
  paginate,
};
