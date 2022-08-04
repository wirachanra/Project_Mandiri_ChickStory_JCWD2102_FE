import axios from "axios";
import jsCookie from "js-cookie";
import store from "../redux/store";
import auth_types from "../redux/reducers/auth/type";
import { configureStore } from "@reduxjs/toolkit";
export const axiosInstance = axios.create({
  baseURL: "http://localhost:2000",
  // headers: {
  //   "x-secret-key": "abc",
  // },
});

axiosInstance.interceptors.request.use((config) => {
  async function setting() {
    config.headers.authorization = jsCookie.get("auth_token");
    // console.log(cookieCutter.get("auth_token"))
  }
  setting();

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status == 419) {
      jsCookie.remove("auth_token");

      store.dispatch({
        type: auth_types.AUTH_LOGOUT,
      });
    }
    return err;
  }
);
