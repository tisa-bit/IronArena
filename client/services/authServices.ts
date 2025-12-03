import gateway from "./gateway";

type LoginPayload = { email: string; password: string };

export const loginStep1 = async (data: LoginPayload) => {
  try {
    console.log("login",data);
    
    const res = await gateway.post("/auth/login", { data });
    return res.data.result;
  } catch (err: any) {
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
  for (const [key, value] of data.entries()) {
    console.log(key, value);
  }

  const res = await gateway.post("/auth/signUp", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const emailOtpVerification = async (tempToken: string, otp: string) => {
  const res = await gateway.post("/auth/emailVerification", {
    accessToken: tempToken,
    otp,
  });
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
  const res = await gateway.put("/auth/changePassword", data);
  return res.data;
};

export const setNewPassword = async (token: string, password: string) => {
  const res = await gateway.post("/auth/setPassword", { token, password });
  return res.data.data;
};

export const sendEmailForgetPassword = async (email: string) => {
  const res = await gateway.post("/auth/forgotPassword", { email });
  return res.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await gateway.post("/auth/resetPassword", {
    token,
    newPassword,
  });
  return res.data;
};
