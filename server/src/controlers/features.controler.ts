import { Request, Response } from "express";
import pdfParse from "pdf-parse";
import { quizPrompt } from "../prompts/quiz-prompt";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

import JSON5 from "json5";

dotenv.config()

// Split the text into exactly 4 equal-sized chunks
const splitIntoChunks = (text: string, parts: number = 4): string[] => {
  const length = text.length;
  const chunkSize = Math.ceil(length / parts);
  const chunks = [];

  for (let i = 0; i < parts; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    chunks.push(text.slice(start, end).trim());
  }

  return chunks;
};

const ai = new GoogleGenAI({
  apiKey: process.env.LLM_API_KEY
});


async function callLLM(prompt: string) {
  const response = await ai.models.generateContent({
    model: process.env.LLM_MODEL || "",
    contents: prompt
  });
  // @ts-expect-error need to check for later
  return JSON5.parse(response.text)
}

export const quiz = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const buffer = req.file.buffer;
    const difficulty = req.body.diffculty;

    // Step 1: Extract text from PDF
    const data = await pdfParse(buffer);
    const extractedText = data.text;

    // Step 2: Split into 4 chunks
    const chunks = splitIntoChunks(extractedText, 4);

    // Step 3: Create prompts for each chunk
    const prompts = chunks.map(chunk => quizPrompt(difficulty, chunk));

    // Step 4: Call all LLM prompts in parallel
    const results = await Promise.all(prompts.map(prompt => callLLM(prompt)));

    // Step 5: Merge all quiz results
    const quiz = results.flat();

    // const prompt = quizPrompt(difficulty, extractedText)
    // const quiz = await callLLM(prompt)
    res.status(200).send(quiz)
  } catch (error) {
    console.error("LLM error:", error);
    // @ts-expect-error error type
    res.status(500).json({ message: "Quiz generation failed", error: error.message });
  }
};