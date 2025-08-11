import axios from "axios"
import type { Dispatch } from "redux"

type AnswerOptions = {
  [key: string]: string
}

type QuizQuestion = {
  question: string
  answerOptions: AnswerOptions
  correctAnswer: string,
  explanation: string
}

type storeQuiz = {
  email: string,
  score: number,
  quizName: string,
  quizzes: QuizQuestion[]
  token: string
}


export const STORE_QUIZ = (payload: storeQuiz) => {
  return async (dispatch: Dispatch) => {
    try {
      console.table(payload)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/store/storequiz`, {
        email: payload.email,
        score: payload.score,
        quizName: payload.quizName,
        quizzes: payload.quizzes
      }, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
      })
      dispatch({
        type: "STORE_QUIZ",
        payload: res
      })
    } catch (error) {
      // @ts-expect-error same error has a prop message
      alert("Unable to store the Quiz " + error.message)
    }
  }
}