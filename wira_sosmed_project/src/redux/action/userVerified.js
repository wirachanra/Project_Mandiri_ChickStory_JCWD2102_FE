import { axiosInstance } from "../../lib/api";
import qs from "qs";

export function userVerified(values, setSubmitting) {
 return async function (dispatch) {
 try {
      let body = {
        verified_status: values.verified_status,
      };

      const res = await axiosInstance.patch(`/user/${values.id}`, qs.stringify(body));

      setSubmitting(false);
    } catch (err) {
      console.log(err);

      setSubmitting(false);
    }
 }
}