import Joi from "joi";
const addCategory = async (req, res, next) => {


  const categorySchema = Joi.object({
    categoryname: Joi.string().required().messages({
      "string.categoryName": "CategoryName  is required",
    }),
  });
  try {
    req.body = await categorySchema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: error.details?.[0]?.message || "Validation error",
    });
  }
};

export default { addCategory };
