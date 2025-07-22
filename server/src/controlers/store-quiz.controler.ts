import { Request, Response } from 'express';
import { QuizResult } from '../models/quiz.model';

export const saveQuizResult = async (req: Request, res: Response) => {
    try {
        console.log('Full request body:', JSON.stringify(req.body, null, 2));

        const { email, score, quizName, quizzes } = req.body;

        const quizResult = new QuizResult({
            email,
            score,
            quizName,
            quizzes
        });
        await quizResult.save();
        res.status(201).json({
            message: 'Quiz saved successfully'
        });
    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving quiz',
            error: error
        });
    }
};