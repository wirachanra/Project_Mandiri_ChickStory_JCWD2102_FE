import { combineReducers, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import auth_reducer from "./reducers/auth/auth";
import automateRendering from "./reducers/render/rendering";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  auth: auth_reducer,
  automateRendering: automateRendering,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

//middleware ? action => reducer. action => function
// action => dispatch => mengubah state

// const store = configureStore({
//   reducer: rootReducer,
// });

export default store;
