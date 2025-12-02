import Joi from "joi";
const addUsers = async (req, res, next) => {
  const usersSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().required(),
    companyname: Joi.string().required(),
  });

  try {
    req.body = await usersSchema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((err) => err.message),
    });
  }
};

export default { addUsers };
