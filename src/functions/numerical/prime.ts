import { Type } from "@google/genai";

export function Prime({ num }: { num: number }): boolean {
  if (num < 2) return false;

  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }

  return true;
}

export const primeDeclaration = {
  name: "prime",
  description: "Checks whether a number is prime.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      num: {
        type: Type.NUMBER,
        description: "Number to check."
      }
    },
    required: ["num"]
  }
};
