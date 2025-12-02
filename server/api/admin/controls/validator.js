import Joi from "joi";

const addControlsValidator = async (req, res, next) => {
 
  const controlsSchema = Joi.object({
    description: Joi.string().required(),
    tips: Joi.string().allow("").optional(),
    controlmapping: Joi.string().allow("").optional(),
    mediaLink: Joi.string().uri().required(),
    categoryId: Joi.number().integer().required(),
    attachmentRequired: Joi.boolean(),
    controlnumber: Joi.number().integer().required(),
  });

  try {
    req.body = await controlsSchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((err) => err.message),
    });
  }
};

export default { addControlsValidator };
