# GenAI Chatbot - Standalone Next.js Application

A standalone Next.js (Pages Router) application built with React, TypeScript, and Tailwind CSS, integrated with the Google GenAI SDK (`@google/genai`).

---

## 🌟 Core Capabilities

* **DSA Instructor (`/api/chat`)**: A specialized assistant configured to guide users on Data Structures, Algorithms, and Competitive Programming. Implements strict boundary guardrails: questions unrelated to computer science are politely declined and answered with a Bhagavad Geeta shloka in Hindi along with a translation and explanation.
* **Gemini Function Calling**: Implements Gemini API function/tool calling to deterministically invoke local TypeScript functions (`prime` and `sum`).
* **AI App-Building Agent (`/api/chat/agent`)**: An autonomous agent route demonstrating server-side command execution via the `executeCommand` tool.
* **Conversation History Handling**: Maps client message states to Gemini schemas and utilizes an execution loop to handle multi-turn tool calling seamlessly.
* **Clean Tailwind UI**: Responsive dark theme interface with conversational history, active session tracking, loading indicators, and enter-to-send messaging.

---

## 📂 Project Structure

```text
genai-chatbot/
├── src/
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   └── api/
│   │       └── chat/
│   │           ├── index.ts
│   │           └── agent.ts
│   ├── functions/
│   │   ├── numerical/
│   │   │   ├── prime.ts
│   │   │   ├── sum.ts
│   │   │   └── index.ts
│   │   ├── commandRunner/
│   │   │   ├── execute.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── README.md
```

---

## 🔌 API Endpoints

### 1. DSA Instructor Chatbot (`/api/chat`)
* Renders the DSA Instructor agent utilizing the **Prime & Sum tools** via function calling.
* Returns a Bhagavad Geeta shloka for off-topic queries.

### 2. App-Builder AI Agent (`/api/chat/agent`)
* Renders the App-Builder agent utilizing the **Command-Execution tool** to execute terminal commands server-side.

---

## 🛠️ Getting Started

### 1. Environment Variables
Create a `.env.local` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Installation
```bash
npm install
```

### 3. Running Locally
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
npm run start
```
