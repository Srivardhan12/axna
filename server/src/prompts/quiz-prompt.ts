export const quizPrompt = (difficulty: string, content: string) => {
  return `
You are an expert quiz generator. Based on the provided context, generate exactly 8 high-quality multiple-choice questions.

Instructions:
- Difficulty: ${difficulty} (Easy = recall, Medium = understand, Hard = apply/analyze)
- Each question must include 4 options labeled A to D
- Include the correct answer key (A/B/C/D) and a brief explanation
- Respond using a strictly valid JSON array with double-quoted keys and values
- Do not use markdown formatting, no code blocks, no syntax highlighting, no headers, no extra notes — only the raw JSON array as plain text

Format:
[
  {
    "question": "Your question here",
    "answerOptions": {
      "A": "First option",
      "B": "Second option",
      "C": "Third option",
      "D": "Fourth option"
    },
    "correctAnswer": "C",
    "explanation": "Explain why this answer is correct and others are not"
  },
  ...
]

Context:
${content}
Only return the JSON array with no extra text.
  `;
};
