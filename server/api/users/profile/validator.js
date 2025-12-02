import Joi from "joi";

const updateProfile = async (req, res, next) => {
  const schema = Joi.object({
    firstname: Joi.string().allow(""),
    lastname: Joi.string().allow(""),
    email: Joi.string().email().allow(""),
  }).options({ stripUnknown: true });

  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export default { updateProfile };
  