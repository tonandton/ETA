import axios from "axios";

// const API_URL = `http://localhost:5000/api-v1`;

const api = axios.create({
  baseURL: "http://localhost:5000/api-v1", // << ตรวจสอบให้ถูกต้อง
  withCredentials: true, // ถ้าใช้งานกับ cookies
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
