import { useSelector } from "react-redux"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeftCircle, ArrowRightCircle, CheckCircle, Loader2 } from "lucide-react"
import { useDispatch } from "react-redux"
import { ANSWERS } from "@/redux/feature-actions"
import { useNavigate } from "react-router-dom"

type AnswerOptions = {
  [key: string]: string
}

type QuizQuestion = {
  question: string
  answerOptions: AnswerOptions
  correctAnswer: string
}

export default function Quiz() {
  const loading = useSelector((state: { loading: boolean }) => state.loading)
  const quiz = useSelector((state: { quiz: QuizQuestion[] }) => state.quiz)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(8).fill(null))

  const handleOptionChange = (value: string) => {
    const updatedAnswers = [...userAnswers]
    updatedAnswers[currentQuestionIndex] = value
    setUserAnswers(updatedAnswers)
  }

  const handleSubmit = () => {
    console.log("Submitted Answers:", userAnswers)
    dispatch(ANSWERS(userAnswers))
    navigate("/dashboard/results")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-center mt-10 text-lg font-medium">
          <Card className="w-96">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <CardTitle className="text-xl mb-2">Patience is the key to success</CardTitle>
              <CardDescription className="text-center">
                Creating your personalized quiz
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <Card className="shadow-lg border rounded-md p-4">
        <CardContent>
          <h2 className="text-xs text-gray-500 font-semibold mb-2">
            Question {currentQuestionIndex + 1} of {quiz.length}
          </h2>
          <p className="text-xl font-medium mb-6">{quiz[currentQuestionIndex].question}</p>
          <RadioGroup
            value={userAnswers[currentQuestionIndex] ?? ""}
            onValueChange={handleOptionChange}
            className="space-y-4"
          >
            {Object.entries(quiz[currentQuestionIndex].answerOptions).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-3">
                <RadioGroupItem className="cursor-pointer" value={key} id={key} />
                <Label htmlFor={key}>
                  <span className="font-medium dark:text-gray-300 cursor-pointer">{key}:</span><span className="font-normal dark:text-gray-300 cursor-pointer">{value}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-8">
            <Button
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="cursor-pointer rounded px-7 py-2.5 min-w-[120px]">
              <ArrowLeftCircle />
              Previous
            </Button>

            {currentQuestionIndex === quiz.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="cursor-pointer rounded px-7 py-2.5 bg-green-600 hover:bg-green-700 text-gray-100 min-w-[120px]s"
              >
                Submit
                <CheckCircle />
              </Button>
            ) : (
              <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                disabled={userAnswers[currentQuestionIndex] === null} className="cursor-pointer min-w-[120px] text-gray-100 rounded px-7 py-2.5 bg-blue-600 hover:bg-blue-700">
                Next
                <ArrowRightCircle />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
