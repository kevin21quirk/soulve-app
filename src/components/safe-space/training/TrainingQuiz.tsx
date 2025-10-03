import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import type { TrainingModule } from '@/types/helperVerification';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface TrainingQuizProps {
  module: TrainingModule;
  onComplete: (score: number, answers: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TrainingQuiz({ module, onComplete, onCancel, isSubmitting }: TrainingQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = module.quiz_questions;
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / totalQuestions) * 100);
    setScore(finalScore);
    setShowResults(true);

    await onComplete(finalScore, answers);
  };

  const currentQuizQuestion = questions[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const allAnswered = Object.keys(answers).length === totalQuestions;
  const passed = score >= module.passing_score;

  if (showResults) {
    return (
      <Card className="p-8 text-center space-y-6">
        <div className="space-y-4">
          {passed ? (
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          ) : (
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          )}
          
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {passed ? 'Congratulations!' : 'Not Quite There'}
            </h2>
            <p className="text-muted-foreground">
              You scored {score}% on this quiz.
              {passed 
                ? ' You have successfully completed this module!'
                : ` You need ${module.passing_score}% to pass. Please review the material and try again.`
              }
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            Correct answers: {Math.round((score / 100) * totalQuestions)} out of {totalQuestions}
          </div>
        </div>

        <Button onClick={onCancel} className="w-full">
          {passed ? 'Continue' : 'Back to Module'}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="text-muted-foreground">
              {Object.keys(answers).length} answered
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{currentQuizQuestion.question}</h3>
          
          <RadioGroup
            value={answers[currentQuestion]?.toString()}
            onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
          >
            <div className="space-y-3">
              {currentQuizQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </Card>

      <div className="flex justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
        </div>

        <div className="flex gap-2">
          {!isLastQuestion ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
