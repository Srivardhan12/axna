import { Request, Response } from 'express';
import { QuizResult } from '../models/quiz.model';

export const saveQuizResult = async (req: Request, res: Response) => {
    try {
        const { email, score, quizName, quizzes } = req.body;

        const isPresent = await QuizResult.findOne({ quizName })
        if (isPresent) return res.status(201).json({ message: "Quiz is already present" })

        const quizResult = await QuizResult.create({
            email,
            score,
            quizName,
            quizzes
        });
        res.status(201).json({
            message: 'Quiz saved successfully'
        });
    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving quiz',
            // @ts-expect-error error has prop message
            error: error.message
        });
    }
};
