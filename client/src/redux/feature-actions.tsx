import axios from "axios";
import type { NavigateFunction } from "react-router-dom";
import { type Dispatch } from "redux";

export const SETPDF = (file: File) => {
  return {
    type: "SET_PDF_FILE",
    payload: file,
  };
};

export const SETDIFFICULTY = (difficulty: string) => {
  return {
    type: "SET_DIFFICULTY",
    payload: difficulty
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const GENERATE_QUIZ = (formData: FormData, token: string, file: File, difficulty: string, navigate: NavigateFunction) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: "QUIZ_REQUEST", payload: {
          file: file, difficulty: difficulty
        }
      });
      navigate("/dashboard/quiz")
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/feature/quiz`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
      );
      dispatch({
        type: "QUIZ_SUCCESS",
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: "QUIZ_FAILURE",
        // @ts-expect-error error parse error
        payload: error.response?.data?.message || error.message || "Unknown error",
      });
    }
  };
};

export const ANSWERS = (userAnswers: Array<string | null>) => {

  return {
    type: "ANSWERS",
    payload: userAnswers
  }
}