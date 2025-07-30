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
    default:
      return state;
  }
};
