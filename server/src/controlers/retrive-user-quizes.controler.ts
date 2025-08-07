import { Request, Response } from "express";
import { QuizResult } from "../models/quiz.model";

export const retriveUserQuizes = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const quizes = await QuizResult.find({ email }).select({ score: 1, quizName: 1, quizzes: 1, createdAt: 1 })
    res.status(200).send(quizes)
  } catch (error) {
    // @ts-expect-error error has prop message
    res.status(200).json({ error: error.message })
  }
}


export const retriveQuizNames = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const existingQuizNames = await QuizResult.find({ email }).select({ quizName: 1 })
    return res.status(200).send(existingQuizNames)
  } catch (error) {
    // @ts-expect-error error has prop message
    return res.status(400).json({ message: error.message })
  }
}