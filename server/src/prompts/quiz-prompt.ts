export const quizPrompt = (difficulty: string, content: string) => {
  return `
        You are an expert quiz generator. Analyze the following content and generate exactly 8 high-quality multiple-choice questions.

        Instructions:
        - Difficulty level: ${difficulty}
        - Easy: Recall facts
        - Medium: Understand concepts
        - Hard: Apply or analyze ideas
        - Each question must have 4 options (A–D)
        - Include the correct answer and a brief explanation
        Respond with only a valid JSON array in this exact format:
        [
        {
            "question": "Question text?",
            "answerOptions": {
            "A": "Option A",
            "B": "Option B",
            "C": "Option C",
            "D": "Option D"
            },
            "correctAnswer": "A",
            "explanation": "Why this is correct and the others are not."
        },
        ...
        ]
        Context:
        ${content}
        No "BACKQUOTES" or "JSON"
        Send only a valid json object
        Not any hearders or copy edit buttons only a valid json not in editor
        `;
};
