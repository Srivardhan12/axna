import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { quizPrompt } from "@/prompts/prompts";
import { useUser } from "@/context/userContextProvider"; // Fixed typo
import { usePDF } from "@/context/pdfContextProvider";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Icons
import {
  Loader2,
  CheckCircle,
  XCircle,
  Home,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Play
} from "lucide-react";

// Types
interface QuizQuestion {
  id: string;
  question: string;
  answerOptions: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  isCompleted: boolean;
  score: number;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';
type QuizStatus = 'idle' | 'loading' | 'ready' | 'completed' | 'error';

// Custom hook for quiz logic
const useQuiz = (pdfText: string | null, difficulty: DifficultyLevel) => {
  const [status, setStatus] = useState<QuizStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    answers: {},
    isCompleted: false,
    score: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const generateQuiz = useCallback(async () => {
    if (!pdfText) return;

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setStatus('loading');
    setError(null);

    try {
      const prompt = quizPrompt({
        difficulty,
        pdfExtractedText: pdfText
      });

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
          "HTTP-Referer": window.location.href || "https://claude.ai",
          "X-Title": "Axna PDF Quiz Generator",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1500,
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Failed to generate quiz: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const quizContent = data.choices[0].message.content;

      // Parse the JSON response
      let parsedQuiz: { quiz: Omit<QuizQuestion, 'id'>[] };
      try {
        parsedQuiz = JSON.parse(quizContent);
      } catch {
        // If direct parsing fails, try to extract JSON from the response
        const jsonMatch = quizContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedQuiz = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from API');
        }
      }

      if (!parsedQuiz.quiz || !Array.isArray(parsedQuiz.quiz)) {
        throw new Error('Invalid quiz format received');
      }

      // Add IDs to questions for better tracking
      const questionsWithIds = parsedQuiz.quiz.map((q: Omit<QuizQuestion, 'id'>, index: number) => ({
        ...q,
        id: `q_${index}_${Date.now()}`
      }));

      setQuizState({
        questions: questionsWithIds,
        currentIndex: 0,
        answers: {},
        isCompleted: false,
        score: 0
      });

      setStatus('ready');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled, ignore
      }

      console.error('Quiz generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
      setStatus('error');
    }
  }, [pdfText, difficulty]);

  const selectAnswer = useCallback((questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  }, []);

  const navigateToQuestion = useCallback((index: number) => {
    setQuizState(prev => ({
      ...prev,
      currentIndex: Math.max(0, Math.min(index, prev.questions.length - 1))
    }));
  }, []);

  const submitQuiz = useCallback(() => {
    const { questions, answers } = quizState;
    let correctCount = 0;

    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    setQuizState(prev => ({
      ...prev,
      score,
      isCompleted: true
    }));

    setStatus('completed');
  }, [quizState]);

  const resetQuiz = useCallback(() => {
    setQuizState({
      questions: [],
      currentIndex: 0,
      answers: {},
      isCompleted: false,
      score: 0
    });
    setStatus('idle');
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    status,
    error,
    quizState,
    generateQuiz,
    selectAnswer,
    navigateToQuestion,
    submitQuiz,
    resetQuiz
  };
};

// Main Quiz Component
export default function Quiz() {
  const { globalSpaceName, pdfExtractedText } = usePDF();
  const { user } = useUser();
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);

  const {
    status,
    error,
    quizState,
    generateQuiz,
    selectAnswer,
    navigateToQuestion,
    submitQuiz,
    resetQuiz
  } = useQuiz(pdfExtractedText, difficulty);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Helper functions
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getDifficultyColor = (level: DifficultyLevel): string => {
    const colors = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[level];
  };

  const handleStartQuiz = () => {
    setShowDifficultySelector(false);
    generateQuiz();
  };

  const handleChangeDifficulty = () => {
    setShowDifficultySelector(true);
    resetQuiz();
  };

  // Difficulty Selection View
  if (showDifficultySelector) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">
              {globalSpaceName ? `${globalSpaceName} Quiz` : 'Quiz Setup'}
            </CardTitle>
            <CardDescription>
              Choose your preferred difficulty level to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty Level</label>
              <Select value={difficulty} onValueChange={(value: DifficultyLevel) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy - Basic concepts</SelectItem>
                  <SelectItem value="medium">Medium - Moderate challenge</SelectItem>
                  <SelectItem value="hard">Hard - Advanced topics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleStartQuiz}
              className="w-full"
              size="lg"
              disabled={!pdfExtractedText}
            >
              <Play className="mr-2 h-4 w-4" />
              Generate Quiz
            </Button>

            {!pdfExtractedText && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please upload a PDF document first to generate a quiz.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading State
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Generating Quiz...</CardTitle>
            <CardDescription className="text-center">
              Creating your personalized {difficulty} level quiz
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-xl mb-2">Quiz Generation Failed</CardTitle>
            <CardDescription className="text-center mb-6">
              {error}
            </CardDescription>
            <div className="flex gap-2 w-full">
              <Button onClick={generateQuiz} className="flex-1">
                <RotateCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={handleChangeDifficulty} className="flex-1">
                Change Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results View
  if (status === 'completed') {
    const { questions, answers, score } = quizState;
    const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;

    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Quiz Complete!</CardTitle>
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
                {score}%
              </div>
              <CardDescription className="text-xl">
                You scored {correctCount} out of {questions.length} questions correctly
              </CardDescription>
              <Badge variant={getScoreBadgeVariant(score)} className="mt-4 text-lg px-4 py-2">
                {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Review Your Answers:</h3>
                  <Separator className="mb-4" />
                </div>

                {questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <Card
                      key={question.id}
                      className="border-l-4"
                      style={{
                        borderLeftColor: isCorrect
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--destructive))'
                      }}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3 mb-4">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          )}

                          <div className="flex-1">
                            <p className="font-medium mb-3">
                              {index + 1}. {question.question}
                            </p>

                            <div className="space-y-2 mb-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm">Your answer:</span>
                                <Badge variant={isCorrect ? "default" : "destructive"}>
                                  {userAnswer
                                    ? `${userAnswer}) ${question.answerOptions[userAnswer]}`
                                    : 'Not answered'
                                  }
                                </Badge>
                              </div>

                              {!isCorrect && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-sm">Correct answer:</span>
                                  <Badge
                                    variant="outline"
                                    className="border-green-500 text-green-600 dark:text-green-400"
                                  >
                                    {question.correctAnswer}) {question.answerOptions[question.correctAnswer]}
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <Alert>
                              <AlertDescription className="text-sm">
                                {question.explanation}
                              </AlertDescription>
                            </Alert>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4 mt-8 justify-center">
                <Button onClick={generateQuiz} size="lg">
                  <RotateCw className="mr-2 h-4 w-4" />
                  Retake Quiz
                </Button>
                <Button variant="outline" onClick={handleChangeDifficulty} size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  New Quiz
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} size="lg">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz Taking View
  if (status === 'ready' && quizState.questions.length > 0) {
    const { questions, currentIndex, answers } = quizState;
    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-background py-8">
        <div className="w-full mx-auto px-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <CardTitle className="text-2xl">
                  {globalSpaceName ? `${globalSpaceName} Quiz` : 'Quiz'}
                </CardTitle>
                <Badge className={getDifficultyColor(difficulty)}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Question {currentIndex + 1} of {questions.length}</span>
                  <span>{answeredCount} answered</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardHeader>

            <CardContent>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6">
                  {currentQuestion.question}
                </h2>

                <div className="grid gap-3">
                  {Object.entries(currentQuestion.answerOptions).map(([key, value]) => (
                    <Button
                      key={key}
                      variant={answers[currentQuestion.id] === key ? "default" : "outline"}
                      className="justify-start text-left h-auto p-4 whitespace-normal"
                      onClick={() => selectAnswer(currentQuestion.id, key as 'A' | 'B' | 'C' | 'D')}
                    >
                      <span className="font-medium mr-3 flex-shrink-0">{key})</span>
                      <span className="flex-1">{value}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigateToQuestion(currentIndex - 1)}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <div className="text-sm text-muted-foreground text-center">
                  {answeredCount} of {questions.length} answered
                </div>

                {currentIndex === questions.length - 1 ? (
                  <Button
                    onClick={submitQuiz}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={answeredCount === 0}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Quiz
                  </Button>
                ) : (
                  <Button onClick={() => navigateToQuestion(currentIndex + 1)}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fallback state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>No Quiz Available</CardTitle>
          <CardDescription>
            Something went wrong. Please try generating a new quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={handleChangeDifficulty} className="flex-1">
              Start Over
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}