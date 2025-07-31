const initialState = {};

type action = {
  type: string,
  payload: object
}

export const reducer = (state = initialState, action: action) => {
  switch (action.type) {
    case "SIGNUP":
      return { ...state, user: action.payload }
    case "SIGNIN":
      return { ...state, user: action.payload }
    case "SET_PDF_FILE":
      return { ...state, file: action.payload };
    case "CLEAR_PDF_FILE":
      return { ...state, file: null, };
    default:
      return state;
  }
};
