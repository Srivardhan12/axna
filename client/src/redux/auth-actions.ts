import type { signin } from "@/components/SigninComponent";
import type { signup } from "@/components/SignupComponent";
import axios from "axios";
import type { NavigateFunction } from "react-router-dom";

type signupAPI = {
  type: string;
  payload: {
    response: object | string,
    isSignup: boolean,
    error?: string
  };
};

type signinAPI = {
  type: string;
  payload: {
    response: object | string,
    isSignup: boolean,
    error?: string
  };
};

export const SIGNUP = (payload: signup, navigate: NavigateFunction) => {
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
        payload: {
          response: response.data || "",
          isSignup: true
        }
      });
      navigate("/signin");

    } catch (err) {
      // @ts-expect-error Cannot find namespace 'axios'. Did you mean 'Axios'?
      const error = err as axios.AxiosError;

      if (error.response) {
        // Server responded with error status
        const serverMessage = error.response.data?.message ||
          error.response.data?.error ||
          error.response.data;

        console.error("Signup error:", error.response.data);

        dispatch({
          type: "SIGNUP",
          payload: {
            response: serverMessage, // Use server's specific error message
            isSignup: false,
            error: serverMessage
          }
        });
      } else if (error.request) {
        // Network error - request was made but no response received
        console.error("Network error:", error.request);

        dispatch({
          type: "SIGNUP",
          payload: {
            response: "Network error. Please check your connection.",
            isSignup: false,
            error: "Network error"
          }
        });
      } else {
        // Something else happened
        console.error("Signup error:", error.message);

        dispatch({
          type: "SIGNUP",
          payload: {
            response: error.message || "An unexpected error occurred",
            isSignup: false,
            error: error.message
          }
        });
      }
    }
  };
};

export const SIGNIN = (payload: signin, navigate: NavigateFunction) => {
  return async (dispatch: (arg0: signinAPI) => void) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signin`,
        {
          email: payload.email,
          password: payload.password,
        }
      );

      dispatch({
        type: "SIGNIN",
        payload: {
          response: response.data || "",
          isSignup: true
        }
      });
      navigate("/dashboard");

    } catch (err) {
      // @ts-expect-error Cannot find namespace 'axios'. Did you mean 'Axios'?
      const error = err as axios.AxiosError;

      if (error.response) {
        // Server responded with error status
        const serverMessage = error.response.data?.message ||
          error.response.data?.error ||
          error.response.data;

        console.error("Signup error:", error.response.data);

        dispatch({
          type: "SIGNUP",
          payload: {
            response: serverMessage, // Use server's specific error message
            isSignup: false,
            error: serverMessage
          }
        });
      } else if (error.request) {
        // Network error - request was made but no response received
        console.error("Network error:", error.request);

        dispatch({
          type: "SIGNIN",
          payload: {
            response: "Network error. Please check your connection.",
            isSignup: false,
            error: "Network error"
          }
        });
      } else {
        // Something else happened
        console.error("Signup error:", error.message);

        dispatch({
          type: "SIGNIN",
          payload: {
            response: error.message || "An unexpected error occurred",
            isSignup: false,
            error: error.message
          }
        });
      }
    }
  };
}

export const LOGOUT = (navigate: NavigateFunction) => {
  // @ts-expect-error dispatch error
  return (dispatch): VoidFunction => {
    dispatch({
      type: "LOGOUT", payload: {
        response: null,
        isSignup: false,
        file: null
      }
    });
    navigate("/");
  };
}