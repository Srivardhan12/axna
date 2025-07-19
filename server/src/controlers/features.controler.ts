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
    const a = JSON.parse(quiz)
    res.send(a);
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
};




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

// Send a single prompt to the LLM
const callLLM = async (prompt: string) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: process.env.LLM_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const content = (response.data as { choices: { message: { content: string } }[] }).choices[0].message.content;
  return JSON.parse(content);
};

export const quizopt = async (req: Request, res: Response) => {
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

    res.send(quiz);
  } catch (error) {
    console.error("LLM error:", error);
    res.status(500).json({ message: "Quiz generation failed", error });
  }
};

