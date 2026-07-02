import { exec } from "child_process";
import { promisify } from "util"; 
import { Type } from "@google/genai";
let execCode=promisify(exec);

export async function executeCommand({command}:{command:string}):Promise<void>{
    let {stdout,stderr}=await execCode(command);
    try{
        if(stderr)console.log(stderr);
        else console.log(stdout);
    }
    catch(error){
        console.log(error)
    }
}


export const executeCommandDeclaration = {
  name: "executeCommand",
  description: "Execute a terminal command",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description: "Command to execute"
      }
    },
    required: ["command"]
  }
};