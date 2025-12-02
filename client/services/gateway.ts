import axios from "axios";

const gateway = axios.create({
  baseURL: "http://localhost:8087/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

if (typeof window !== "undefined") {
  gateway.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    const tempToken = localStorage.getItem("tempSubscribeToken");
    const tokenToUse = tempToken || accessToken;
    if (tokenToUse && config.headers) {
      config.headers["Authorization"] = `Bearer ${tokenToUse}`;
    }
    return config;
  });
}

export default gateway;
