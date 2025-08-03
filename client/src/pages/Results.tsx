import { useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

type QuizQuestion = {
 question: string
 answerOptions: {
  A: string
  B: string
  C: string
  D: string
 }
 correctAnswer: string
 explanation: string
}

export default function Results() {
 const userAnswers = useSelector((state: { userAnswers: string[] }) => state.userAnswers)
 const quiz = useSelector((state: { quiz: QuizQuestion[] }) => state.quiz)

 const getAnswerText = (question: QuizQuestion, answerKey: string) => {
  return question.answerOptions[answerKey as keyof typeof question.answerOptions]
 }

 const score = userAnswers.reduce((acc, answer, index) => {
  return answer === quiz[index].correctAnswer ? acc + 1 : acc
 }, 0)

 return (
  <div className="max-w-3xl mx-auto px-4 pb-8">
   <h1 className="text-2xl font-bold mb-4 text-center">RESULTS</h1>
   <div className="text-center text-lg font-medium mb-8">
    You scored {score} / {quiz.length}
   </div>

   {quiz.map((question, index) => {
    const userAnswer = userAnswers[index]
    const isCorrect = userAnswer === question.correctAnswer
    const userAnswerText = getAnswerText(question, userAnswer)
    const correctAnswerText = getAnswerText(question, question.correctAnswer)

    return (
     <Card key={index} className="mb-6 border shadow-md rounded-2xl">
      <CardContent className="p-6">
       <h2 className="text-md font-semibold mb-4">Q{index + 1}. {question.question}</h2>
       <div className="space-y-2">
        <div
         className={`p-2 rounded font-medium text-sm border-2 text-gray-100 ${isCorrect ? "border-green-400 dark:bg-green-700 bg-green-500" : "bg-red-600 dark:bg-red-800 border-red-600"}`}>
         Your Answer: {userAnswer} — {userAnswerText}
        </div>

        {!isCorrect && (
         <div className="p-2 rounded border-2 border-green-400 dark:bg-green-700 bg-green-500">
          <span className="font-medium text-sm text-gray-100">Correct Answer: {question.correctAnswer} — {correctAnswerText}</span>
         </div>
        )}

        <div className="text-sm text-muted-foreground mt-2">
         <span className="font-semibold">Explanation:</span> {question.explanation}
        </div>
       </div>
      </CardContent>
     </Card>
    )
   })}

   <Separator className="my-6" />
   <div className="text-center">
    <Link to="/dashboard/quiz">
     <Button className="text-base px-7 rounded cursor-pointer">
      Retake
     </Button>
     <Button className="ml-5 text-base px-7 rounded cursor-pointer">
      Store Quiz
     </Button>
    </Link>
   </div>
  </div>
 )
}
