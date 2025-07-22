import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion {
  question: string;
  answerOptions: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
}

interface IQuizResult extends Document {
  email: string;
  score: number;
  quizName: string;
  quizzes: IQuestion[];
}

const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  answerOptions: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true }
  },
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true }
});

const quizResultSchema = new Schema<IQuizResult>({
  email: { type: String, required: true },
  score: { type: Number, required: true },
  quizName: { type: String, required: true },
  quizzes: [questionSchema]
}, { timestamps: true });

export const QuizResult = mongoose.model<IQuizResult>('QuizResult', quizResultSchema);