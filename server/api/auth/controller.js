import service from "./service.js";

export const signupController = async (req, res) => {
  // console.log("signup controller",req.body)
  try {
    const data = await service.signupService(req.body);
    return res.json({ message: "User created successfully", data });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Signup failed" });
  }
};

const emailVerifyOtp = async (req, res) => {
  try {
    const { accessToken, otp } = req.body;
    const result = await service.emailverificationOtp(accessToken, otp);
    return res.status(200).json({ message: "OTP Verified", ...result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const result = await service.loginService(req.body);

    console.log("login controller", result);

    return res.status(200).json({
      message: "Login successful",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      type: error.type || "general",
      message: error.message || "Login failed",
    });
  }
};

// const authenticatorLoginController = async (req, res) => {
//   try {
//     const response = await service.authenticatorLoginService(req.body);
//     return res.status(200).json({ message: "success", ...response });
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };

const authenticatorLoginVerifyOtp = async (req, res) => {
  try {
    const { accessToken, otp } = req.body;
    const result = await service.authenticatorVerifyOtp(accessToken, otp);
    return res.status(200).json({ message: "OTP Verified", ...result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const setupTwoFA = async (req, res) => {
  try {
    const result = await service.setupTwoFAService(req.user.id);
    return res.status(200).json({ message: "2FA setup initiated", ...result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const verifyTwoFASetup = async (req, res) => {
  try {
    const { otp } = req.body;
    const result = await service.verifyTwoFASetupService(req.user.id, otp);
    return res
      .status(200)
      .json({ message: "2FA enabled successfully", ...result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const setPassword = async (req, res) => {
  try {
    const data = await service.setPasswordService(
      req.body.token,
      req.body.password
    );
    return res.status(200).json({ message: "Password set successfully", data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  // console.log("change password", req.body);

  try {
    const result = await service.updatePassword(req.user.id, req.body);
    return res.status(200).json({ message: "updated password", result });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await service.forgotPassword(req.body);
    return res
      .status(200)
      .json({ message: "email send to update password", result });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await service.resetPasswordService(req.body);
    return res
      .status(200)
      .json({ message: "password reset successfull", result });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};
export default {
  signupController,
  emailVerifyOtp,
  loginController,

  authenticatorLoginVerifyOtp,
  setupTwoFA,
  verifyTwoFASetup,
  setPassword,
  changePassword,
  forgotPassword,
  resetPassword,
};
