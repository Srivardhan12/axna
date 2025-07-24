import type { signup } from "@/components/SignupComponent"
import axios from "axios"
import { } from "react-router-dom"

type signupAPI = {
  type: string,
  payload: object
}

export const SIGNUP = (payload: signup) => {
  return async (dispatch: (arg0: signupAPI) => void) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          username: payload.username,
          email: payload.email,
          password: payload.password,
        }
      );

      dispatch({
        type: "SIGNUP",
        payload: response.data || "",
      });

      return true;
    } catch (error) {
      // @ts-expect-error testing
      const res = { status: false, message: error.response.data.message }
      return res
    }
  };
};


export const SIGNIN = () => {
  return { type: "SIGNIN" }
}