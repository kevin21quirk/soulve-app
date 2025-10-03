import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TrainingModule, QuizQuestion } from '@/types/helperVerification';
import { getDifficultyColor, getDifficultyLabel } from '@/utils/quizHelpers';
import { cn } from '@/lib/utils';

interface TrainingQuizProps {
  module: TrainingModule;
  onComplete: (score: number, answers: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TrainingQuiz({ module, onComplete, onCancel, isSubmitting }: TrainingQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [reviewMode, setReviewMode] = useState(false);

  const questions = module.quiz_questions || [];
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = Object.keys(answers).length === questions.length;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (reviewMode) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  const handleReviewAnswers = () => {
    setReviewMode(true);
    setShowResults(false);
    setCurrentQuestion(0);
  };

  const handleFinish = async () => {
    const timeSpent = Math.round((Date.now() - startTime) / 60000);
    await onComplete(score, {
      answers,
      timeSpent,
      questionCount: questions.length,
      correctCount: Math.round((score / 100) * questions.length)
    });
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const isPassed = score >= module.passing_score;
  const timeSpent = Math.round((Date.now() - startTime) / 60000);

  if (showResults) {
    const correctCount = Math.round((score / 100) * questions.length);
    const difficultyBreakdown = questions.reduce((acc, q) => {
      const difficulty = q.difficulty || 'medium';
      const isCorrect = answers[questions.indexOf(q)] === q.correct_answer;
      if (!acc[difficulty]) {
        acc[difficulty] = { total: 0, correct: 0 };
      }
      acc[difficulty].total++;
      if (isCorrect) acc[difficulty].correct++;
      return acc;
    }, {} as Record<string, { total: number; correct: number }>);

    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {isPassed ? (
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500" />
            )}
          </div>
          <div>
            <CardTitle className="text-3xl">
              {isPassed ? 'Congratulations!' : 'Not Quite There'}
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              You scored {score}% ({correctCount}/{questions.length} correct)
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your Score</span>
              <span className="font-medium">{score}%</span>
            </div>
            <Progress value={score} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Passing Score: {module.passing_score}%</span>
              <span>Time: {timeSpent} min</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-sm">Performance by Difficulty</h3>
            {Object.entries(difficultyBreakdown).map(([difficulty, stats]) => (
              <div key={difficulty} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getDifficultyColor(difficulty)}>
                    {getDifficultyLabel(difficulty)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {stats.correct}/{stats.total} correct
                  </span>
                </div>
                <Progress 
                  value={(stats.correct / stats.total) * 100} 
                  className="w-32 h-2"
                />
              </div>
            ))}
          </div>

          {module.max_attempts && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>
                {isPassed 
                  ? 'Module completed successfully!'
                  : `You can retry this module${module.max_attempts > 1 ? `. Attempts will be tracked.` : '.'}`
                }
              </span>
            </div>
          )}

          <div className={cn(
            "p-4 rounded-lg border-2",
            isPassed 
              ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
              : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
          )}>
            <p className={cn(
              "text-sm font-medium",
              isPassed ? "text-green-800 dark:text-green-400" : "text-red-800 dark:text-red-400"
            )}>
              {isPassed 
                ? 'You have successfully passed this module!'
                : `You scored ${score}% but need ${module.passing_score}% to pass.`
              }
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleReviewAnswers}
              className="flex-1"
            >
              Review Answers
            </Button>
            <Button 
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isPassed ? 'Continue' : 'Back to Training'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No questions available</p>
        </CardContent>
      </Card>
    );
  }

  const isAnswered = answers[currentQuestion] !== undefined;
  const userAnswer = answers[currentQuestion];
  const correctAnswer = question.correct_answer;
  const isCorrect = reviewMode && userAnswer === correctAnswer;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-xl">{module.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{timeSpent} min</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const answered = answers[idx] !== undefined;
                const isCurrent = idx === currentQuestion;
                const isCorrectAnswer = reviewMode && answers[idx] === q.correct_answer;
                const isIncorrectAnswer = reviewMode && answers[idx] !== undefined && answers[idx] !== q.correct_answer;
                
                return (
                  <button
                    key={idx}
                    onClick={() => jumpToQuestion(idx)}
                    disabled={reviewMode && !answered}
                    className={cn(
                      "aspect-square rounded-md text-sm font-medium transition-colors",
                      isCurrent && "ring-2 ring-primary ring-offset-2",
                      !answered && !reviewMode && "bg-muted text-muted-foreground hover:bg-muted/80",
                      answered && !reviewMode && "bg-primary text-primary-foreground",
                      isCorrectAnswer && "bg-green-500 text-white",
                      isIncorrectAnswer && "bg-red-500 text-white",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            {!reviewMode && (
              <div className="pt-3 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-muted" />
                  <span>Not Answered</span>
                </div>
              </div>
            )}

            {reviewMode && (
              <div className="pt-3 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  <span>Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span>Incorrect</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className={getDifficultyColor(question.difficulty || 'medium')}>
                      {getDifficultyLabel(question.difficulty || 'medium')}
                    </Badge>
                    {reviewMode && (
                      <Badge variant={isCorrect ? "default" : "destructive"} className="gap-1">
                        {isCorrect ? (
                          <><CheckCircle2 className="w-3 h-3" /> Correct</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Incorrect</>
                        )}
                      </Badge>
                    )}
                  </div>
                  {question.scenario && (
                    <div className="p-3 mb-4 bg-muted/50 rounded-lg border border-muted">
                      <p className="text-sm font-medium text-muted-foreground italic">
                        Scenario: {question.scenario}
                      </p>
                    </div>
                  )}
                  <CardTitle className="text-lg leading-relaxed">
                    {question.question}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = userAnswer === idx;
                const isTheCorrectAnswer = idx === correctAnswer;
                const showCorrect = reviewMode && isTheCorrectAnswer;
                const showIncorrect = reviewMode && isSelected && !isTheCorrectAnswer;

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={reviewMode}
                    className={cn(
                      "w-full p-4 text-left rounded-lg border-2 transition-all",
                      "hover:border-primary hover:bg-muted/50",
                      isSelected && !reviewMode && "border-primary bg-primary/5",
                      showCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                      showIncorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                      !isSelected && !showCorrect && !showIncorrect && "border-muted",
                      reviewMode && "cursor-default"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium mt-0.5",
                        isSelected && !reviewMode && "border-primary bg-primary text-primary-foreground",
                        showCorrect && "border-green-500 bg-green-500 text-white",
                        showIncorrect && "border-red-500 bg-red-500 text-white",
                        !isSelected && !showCorrect && !showIncorrect && "border-muted-foreground/30"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={cn(
                        "flex-1",
                        showCorrect && "text-green-800 dark:text-green-400 font-medium",
                        showIncorrect && "text-red-800 dark:text-red-400"
                      )}>
                        {option}
                      </span>
                      {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      {showIncorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {reviewMode && question.explanation && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{question.explanation}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {reviewMode ? (
                    <Button onClick={() => setShowResults(true)}>
                      Back to Results
                    </Button>
                  ) : (
                    <>
                      {currentQuestion === questions.length - 1 ? (
                        <Button
                          onClick={handleSubmit}
                          disabled={!allAnswered}
                          className="gap-2"
                        >
                          Submit Quiz
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNext}
                          disabled={currentQuestion === questions.length - 1}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {!reviewMode && !allAnswered && currentQuestion === questions.length - 1 && (
                <p className="text-sm text-muted-foreground text-center mt-3">
                  Answer all questions to submit
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
