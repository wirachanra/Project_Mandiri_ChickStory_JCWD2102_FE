const initialRender = {
 value: false,
};

const automateRendering = (state = initialRender, action) => {
 if(action.type === "FETCH_RENDER" ) {
  return {
   ...state,
   value: action.payload.value
  };
 }
 return state
}

export default automateRendering;