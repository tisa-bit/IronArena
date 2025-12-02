import Joi from "joi";

export const signupValidator = async (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const signupSchema = Joi.object({
    firstname: Joi.string().required().trim(),
    lastname: Joi.string().required().trim(),
    companyname: Joi.string().required().trim(),
    email: Joi.string()
      .required()
      .pattern(emailRegex)
      .message("Enter valid email"),
    password: Joi.string()
      .required()
      .pattern(passwordRegex)
      .message(
        "Password must be at least 8 characters long and include one number & one special char"
      ),
    confirmPassword: Joi.string().required(),
    companyLogo: Joi.string().allow(null, ""), // optional
  }).options({ stripUnknown: true });

  try {
    req.body = await signupSchema.validateAsync(req.body);
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: err.details?.[0]?.message || "Validation error" });
  }
};

const verifyemail = async (req, res, next) => {
  try {
    const emailVerificationSchema = Joi.object({
      accessToken: Joi.string().required(),
      otp: Joi.string().required(),
    }).options({ stripUnknown: true });

    req.body = await emailVerificationSchema.validateAsync(req.body);
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: err.details?.[0]?.message || err.message });
  }
};
const loginValidator = async (req, res, next) => {

  const { email, password } = req.body.data;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const loginSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "Enter valid email id",
        "string.empty": "Email is required",
      }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  });
  try {
    req.body = await loginSchema.validateAsync(req.body.data);
    next();
  } catch (error) {
    return res.status(400).json({
      message: error.details?.[0]?.message || "Validation error",
    });
  }
};

const verifytwofa = async (req, res, next) => {
  try {
    const twoFaSchema = Joi.object({
      accessToken: Joi.string().required(),
      otp: Joi.string()
        .pattern(/^\d{6}$/)
        .required(),
    }).options({ stripUnknown: true });

    req.body = await twoFaSchema.validateAsync(req.body);
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: err.details?.[0]?.message || err.message });
  }
};

const verifySetupOtp = async (req, res, next) => {
  try {
    const schema = Joi.object({
      otp: Joi.string()
        .pattern(/^\d{6}$/)
        .required(),
    }).options({ stripUnknown: true });

    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: err.details?.[0]?.message || err.message });
  }
};

const changePasswordValidation = async (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }).options({ stripUnknown: true });

  try {
    req.body = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json(failedResponse(err.message));
  }
};

const forgotPassword = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  }).options({ stripUnknown: true });
  try {
    req.body = await schema.validateAsync(req.body);

    next();
  } catch (err) {
    return res.status(400).json(failedResponse(err.message));
  }
};
const validateResetPassword = async (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }).options({ stripUnknown: true });
  try {
    req.body = await schema.validateAsync(req.body);

    next();
  } catch (err) {
    return res.status(400).json(failedResponse(err.message));
  }
};
export default {
  signupValidator,
  verifyemail,
  loginValidator,
  verifytwofa,
  verifySetupOtp,
  changePasswordValidation,
  forgotPassword,
  validateResetPassword,
};
