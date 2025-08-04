const initialState = {
  user: null,
  isSignup: null,
  file: null,
  difficulty: null,
  quiz: null,
  loading: false,
  error: null,
};

type action = {
  type: string;
  payload?: {
    response?: string | null;
    isSignup?: boolean | null;
    file?: File | null;
    difficulty?: string | null;
    quiz?: object;
    error?: string;
  };
};

export const reducer = (state = initialState, action: action) => {
  switch (action.type) {
    case "SIGNUP":
    case "SIGNIN":
      return {
        ...state,
        user: action.payload?.response,
        isSignup: action.payload?.isSignup,
        quiz: null
      };

    case "SET_PDF_FILE":
      return {
        ...state,
        file: action.payload?.file,
        quiz: null
      };

    case "SET_DIFFICULTY":
      return {
        ...state,
        difficulty: action.payload?.difficulty,
        quiz: null
      };

    case "QUIZ_REQUEST":
      return {
        ...state,
        loading: true,
        file: action.payload?.file,
        difficulty: action.payload?.difficulty,
        quiz: null

      };

    case "QUIZ_SUCCESS":
      return {
        ...state,
        loading: false,
        quiz: action.payload || null,
      };

    case "QUIZ_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload || "Something went wrong",
      };

    case "ANSWERS":
      return {
        ...state,
        userAnswers: action.payload
      }

    case "LOGOUT":
      return {
        user: null,
        isSignup: null,
        file: null,
        difficulty: null,
        quiz: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};
