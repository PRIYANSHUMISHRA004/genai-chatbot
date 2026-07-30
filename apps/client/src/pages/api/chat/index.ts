import { GoogleGenAI } from "@google/genai";
import { Prime, primeDeclaration, sum, sumDeclaration } from "functions";
import type { NextApiRequest, NextApiResponse } from "next";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

type Message = {
  role: "user" | "model";
  content: string;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const tools = [
  {
    functionDeclarations: [primeDeclaration, sumDeclaration],
  },
];

const functions = {
  prime: Prime,
  sum: sum,
};

function formatHistory(history: Message[]): any[] {
  return history.map((message) => ({
    role: message.role,
    parts: [
      {
        text: message.content,
      },
    ],
  }));
}

async function chatAI(history: Message[]): Promise<string> {
  const contents = formatHistory(history);
  console.log('HISTORY SIZE IS ',contents.length)

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: `
You are an expert Data Structures and Algorithms instructor.

Rules:
- Answer ONLY DSA and Competitive Programming related questions.
- Give optimal solutions.
- Explain in simple language.
- Mention time and space complexity whenever applicable.
- If the question is unrelated to DSA, politely refuse and reply with one Geeta shloka in Hindi along with a simple explanation.
        `,
        tools,
      },
    });

    const functionCall = response.functionCalls?.[0];

    if (!functionCall) {
      return response.text || "";
    }

    const { name, args, id } = functionCall;

    if (!name || !(name in functions)) {
      return "Unsupported function.";
    }

    const result = functions[name as keyof typeof functions](args as any);

    contents.push({
      role: "model",
      parts: [
        {
          functionCall,
        },
      ],
    });

    contents.push({
      role: "user",
      parts: [
        {
          functionResponse: {
            id,
            name,
            response: {
              result,
            },
          },
        },
      ],
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('in DSA SESSION')
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "GEMINI_API_KEY is missing",
      });
    }

    const { history } = req.body;

    const reply = await chatAI(history);

    return res.status(200).json({
      message: reply,
    });
  } catch (error: any) {
    console.error(error);
    if (error.status === 429 || (error.message && error.message.includes("429"))) {
      return res.status(429).json({
        message: "Gemini API Quota Exceeded. Please try again later.",
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}