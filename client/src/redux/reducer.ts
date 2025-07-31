const initialState = {};

type action = {
  type: string,
  payload: {
    response: string,
    isSignup: boolean,
    file: File
  }
}

export const reducer = (state = initialState, action: action) => {
  switch (action.type) {
    case "SIGNUP":
      return { ...state, user: action.payload.response, isSignup: action.payload.isSignup }
    case "SIGNIN":
      return { ...state, user: action.payload.response, isSignup: action.payload.isSignup }
    case "SET_PDF_FILE":
      return { ...state, file: action.payload };
    case "CLEAR_PDF_FILE":
      return { ...state, file: null, };
    case "LOGOUT":
      return { ...state, user: action.payload.response, isSignup: action.payload.isSignup, file: action.payload.file }
    default:
      return state;
  }
};
