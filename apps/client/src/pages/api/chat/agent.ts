import { GoogleGenAI } from "@google/genai";
import { executeCommand, executeCommandDeclaration } from "functions";
import type { NextApiRequest, NextApiResponse } from "next";
import os from 'os';

type Data={
    message:string
}

type history={
    role:"user"|"model",
    content:string
}

let fn = {
  executeCommand
};
let ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
let platform=os.platform();
 async function main(history:history[]){
    let contents:any[]=history.map((msg)=>{
        return {
            role:msg.role,
            parts:[{text:msg.content},]
        }
    });
    let systemInstruction=`
    you are ai agent who build app according to massage your job is to create frontend you have acess to tool called executeCommand which execute any terminal command user current platform is ${platform}
    <--your role-->
    1 analyse user query 
    2 give command step wise
    3 use tool to execute command 
    // steps 
    1 create directory,
    2 make html file,
    3 make css file,
    4 make script file,
    5 write code in files

    you have to give terminal or shell command as argument , execute them using tools if all functins are executed then return congratulation massage in response text IT IS TEST VESRION SO MAKE SMALL COMMAND AND AS I HAVE LIMIT OF 20 MASSAGE FROM AI MODEL 

    `;
    let tools=[{functionDeclarations :[executeCommandDeclaration]}]
    let config={
        systemInstruction,
        tools
    }
    while (true){
    let res=await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config
    })
     let fnCall = res.functionCalls;
    if (fnCall && fnCall.length > 0) {
      let { name, args, id } = fnCall[0];
      if (name && name in fn && args) {
        const tool = fn[name as keyof typeof fn];
        const result = await tool(args as any);
        const functionRes = {
          name: name,
          response: {
            result,
          },
          id,
        };
        console.log(`Radhe Radhe name ${name} args ${JSON.stringify(args.command)} `)
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
    }}

}
export default async function Handler(req:NextApiRequest,res:NextApiResponse<Data>){
  let {history}=req.body;
  let result=await main(history);
  console.log(`Radhe Radhe i am agent api`)
    return res.json({message:`Radhe Radhe ${result}`});
}