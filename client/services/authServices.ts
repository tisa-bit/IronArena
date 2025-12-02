import gateway from "./gateway";

type LoginPayload = { email: string; password: string };

export const loginStep1 = async (data: LoginPayload) => {
  try {
    console.log("login response",data);
    
    const res = await gateway.post("/auth/login", { data });
    return res.data; // successful login response
  } catch (err: any) {
    // If Axios returns a response with error message
    if (err.response) {
      return {
        success: false,
        message: err.response.data.message || "Invalid credentials",
      };
    } else {
      return {
        success: false,
        message: "Network error. Please try again later.",
      };
    }
  }
};

export const SignUp = async (data: FormData) => {
  // Debug: log all FormData keys and values
  for (const [key, value] of data.entries()) {
    console.log(key, value);
  }

  const res = await gateway.post("/auth/signUp", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log(res.data);
  return res.data;
};

export const emailOtpVerification = async (tempToken: string, otp: string) => {
  const res = await gateway.post("/auth/emailVerification", {
    accessToken: tempToken,
    otp,
  });
  console.log(res.data);

  return res.data;
};

export const verify2FALoginOTP = async (tempToken: string, otp: string) => {
  const res = await gateway.post("/auth/2FAverifyotp", {
    accessToken: tempToken,
    otp,
  });
  return res.data;
};

export const setupTwoFA = async () => {
  const res = await gateway.post("/auth/2fa/setUp");
  return res.data;
};

export const verifySetupTwoFA = async (otp: string) => {
  const res = await gateway.post("/auth/2fa/verifySetup", { otp });
  return res.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  console.log("change password", data);

  const res = await gateway.put("/auth/changePassword", data);
  return res.data;
};

export const setNewPassword = async (token: string, password: string) => {
  const res = await gateway.post("/auth/setPassword", { token, password });
  return res.data;
};

export const sendEmailForgetPassword = async (email: string) => {
  const res = await gateway.post("/auth/forgotPassword", { email });
  // console.log(res);
  return res.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  console.log("reset", token, newPassword);

  const res = await gateway.post("/auth/resetPassword", {
    token,
    newPassword,
  });
  console.log("res.data", res.data.result);

  return res.data;
};
