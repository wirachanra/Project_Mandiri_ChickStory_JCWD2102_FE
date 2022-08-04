const init_state = {
  id: 0,
  username: "",
  email: "",
  full_name: "",
  verified_status: 0,
  online_status: 0,
  bio: "",
  phone_no: "",
  gender: "",
  web: "",
  image_url: "",
  total_post: 0,
};
import auth_types from "./type";

function auth_reducer(state = init_state, action) {
  if (action.type === auth_types.AUTH_LOGIN) {
    return {
      ...state,
      id: action.payload.id,
      username: action.payload.username,
      email: action.payload.email,
      full_name: action.payload.full_name,
      verified_status: action.payload.verified_status,
      online_status: action.payload.online_status,
      bio: action.payload.bio,
      phone_no: action.payload.phone_no,
      gender: action.payload.gender,
      web: action.payload.web,
      image_url: action.payload.image_url,
      total_post: action.payload.total_post,
    };
  } else if (action.type === auth_types.AUTH_LOGOUT) {
    return init_state;
  }

  return state;
}

export default auth_reducer;
