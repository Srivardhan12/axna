import { Request, Response } from "express";
import pdfParse from "pdf-parse";
import axios from "axios";
import { quizPrompt } from "../prompts/quiz-prompt";

export const quiz = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // get file data
    const buffer = req.file.buffer;
    const diffculty = req.body.diffculty

    // extract data from the pdf
    const data = await pdfParse(buffer);
    const extractedText = data.text;

    const quizprompt = quizPrompt(diffculty, extractedText)

    // calling llm for quiz
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: process.env.LLM_MODEL,
      messages: [
        {
          role: "user",
          content: quizprompt,
          temperature: 1
        },
      ],
    },
      {
        headers: {
          Authorization: `Bearer ${process.env.LLM_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const quiz = (response.data as { choices: { message: { content: string } }[] }).choices[0].message.content;
    console.table(quiz)

    res.json({ message: "PDF Recived", quiz: quiz });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
};
