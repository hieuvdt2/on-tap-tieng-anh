export function scoreAnswer(correctAnswer: string, selectedAnswer: string) {
  return selectedAnswer.length > 0 && selectedAnswer === correctAnswer;
}
