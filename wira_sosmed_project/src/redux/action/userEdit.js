import { axiosInstance } from "../../lib/api";
import qs from "qs";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from "react";

export function userEdit(values, setSubmitting) {
  // const autoRender = useSelector((state) => state.automateRendering)

  return async function (dispatch) {
    try {
      let body = {
        full_name: values.full_name,
        username: values.username,
        phone_no: values.phone_no,
        web: values.website,
        gender: values.gender,
        bio: values.bio,
      };
  const res =    await axiosInstance.patch(`/user/${values.id}`, qs.stringify(body));

          console.log(res)

    // dispatch({
    //         type: "FETCH_RENDER",
    //         payload: { value: !autoRender.value }
    //       })

          dispatch({
            type: "AUTH_LOGIN",
            payload: res.data.user
          })
      setSubmitting(false);
    } catch (err) {
      console.log(err);
      alert("sd")
      setSubmitting(false);
    }
  };
}
