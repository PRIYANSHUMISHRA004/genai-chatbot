
import { Output,SignUp,Input } from "@repo/ui"
import axios from 'axios'
import { useRef, useState } from "react";
type Message = {
  role: "user" | "model";
  content: string;
};

export default function Home() {
  const [output, setOutput] = useState("");
  //const [history,setHistory]=useState<Message[]>([])
  const historyRef = useRef<Message[]>([]);

  async function onClick(chat: string): Promise<void> {
    historyRef.current.push({
      role:"user",
      content:chat
    })
    const res = await axios.post("/api/chat/agent", {
      history: historyRef.current,
    });
     historyRef.current.push({
      role:"model",
      content:res.data.message
    })
//console.log(historyRef.current);
console.log(`Radhe Radhe current history is ${JSON.stringify(historyRef.current)}`)
    setOutput(res.data.message);
  }

  return (
    <>
      <div>
        Jai Shree Ram
        <Input onClick={onClick} />
        <Output res={output} />
      </div>
    </>
  );
}
