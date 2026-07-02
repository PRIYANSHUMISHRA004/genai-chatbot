import { Type } from "@google/genai";

type InputProps = {
  num1: number;
  num2: number;
};

export function sum({ num1, num2 }: InputProps): number {
  return num1 + num2;
}

export const sumDeclaration = {
  name: "sum",
  description: "Returns the sum of two numbers",
  parameters: {
    type: Type.OBJECT,
    properties: {
      num1: {
        type: Type.NUMBER,
        description: "First number",
      },
      num2: {
        type: Type.NUMBER,
        description: "Second number",
      },
    },
    required: ["num1", "num2"],
  },
};