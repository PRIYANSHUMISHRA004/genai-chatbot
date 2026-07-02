import { GoogleGenAI } from "@google/genai";
import { Prime, primeDeclaration, sum, sumDeclaration } from "functions";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};
type Message = {
  role: "user" | "model";
  content: string;
};
let fn = {
  prime: Prime,
  sum: sum,
};
const tools = [
  {
    functionDeclarations: [primeDeclaration, sumDeclaration],
  },
];

let ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(userChat: string): Promise<string> {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    config: {
      systemInstruction: `Radhe Radhe You are Data Structre And Algorithm  instructor ,You Only reply to problem related to Data Structure And Algorithm With Optimal Solution in Simple way ,BUt if question is not related to Data structure ad Algorithm Reply him Politely with one Geeta SLok in Hndi with definition in simple way`,
    },
  });
  let res = await chat.sendMessage({
    message: userChat,
  });
  return res.text ? res.text : "";
}
async function ChatAI(history: Message[]): Promise<string> {
  // converting history in proper fromet
  const contents: any[] = history.map((msg) => ({
    role: msg.role,
    parts: [
      {
        text: msg.content,
      },
    ],
  }));
  while (true) {
    let res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        tools: tools,
      },
    });
    let fnCall = res.functionCalls;
    if (fnCall && fnCall.length > 0) {
      let { name, args, id } = fnCall[0];
      if (name && name in fn && args) {
        const tool = fn[name as keyof typeof fn];
        const result = tool(args as any);
        const functionRes = {
          name: name,
          response: {
            result: result,
          },
          id,
        };
        console.log(`Radhe Radhe name ${name} num1 ${args.num} `)
        contents.push({
          role: "model",
          parts: [
            {
              functionCall: fnCall[0],
            },
          ],
        });
        contents.push({
          role: "user",
          parts: [
            {
              functionResponse: functionRes,
            },
          ],
        });
      }
    } else {
      return res.text ? res.text : "";
    }
  }
  //
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "GEMINI_API_KEY is missing" });
    }

    const dt = await ChatAI(history);
    return res.status(200).json({ message: dt });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
