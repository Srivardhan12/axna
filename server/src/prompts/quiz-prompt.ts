export const quizPrompt = (difficulty: string, content: string) => {
  return `
        You are an expert quiz generator. Analyze the following content and generate exactly 2 high-quality multiple-choice questions.

        Instructions:
        - Difficulty level: ${difficulty}
        - Easy: Recall facts
        - Medium: Understand concepts
        - Hard: Apply or analyze ideas
        - Each question must have 4 options (A–D)
        - Include the correct answer and a brief explanation
        - Focus only on the most important concepts
        - Do NOT include any text before or after the JSON

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
        YOU ARE THE BEST AI MODEL OUT THERE SO PLEASE GENERATE THEM AS FAST AS POSSIABLE, GO COMON FAST VERY FAST
        GENERATE AND RETURN ONLY A VALID JSON OBJECT
        No BACKQUOTES or "JSON"
        `;
};
