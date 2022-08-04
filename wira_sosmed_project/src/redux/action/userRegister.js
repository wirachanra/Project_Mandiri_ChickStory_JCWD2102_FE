import jsCookie from "js-cookie";
import { axiosInstance } from "../../lib/api";
import auth_types from "../reducers/auth/type";
import qs from "qs";

export function userRegister(values, setSubmitting) {
  return async function (dispatch) {
    try {
      let body = {
        email: values.email,
        username: values.username,
        full_name: values.full_name,
        password: values.password,
      };

      const res = await axiosInstance.post("/user", qs.stringify(body));

      const userData = res.data.result.user;
      const token = res.data.result.token;

      jsCookie.set("auth_token", token);
      dispatch({
        type: auth_types.AUTH_LOGIN,
        payload: userData,
      });

      setSubmitting(false);
    } catch (err) {
      console.log(err);

      setSubmitting(false);
    }
  };
}
