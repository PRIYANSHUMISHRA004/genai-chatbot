# GenAI Chatbot - Next.js Application

A fast, lightweight Next.js (Pages Router) chat application built with React 19, TypeScript, Tailwind CSS, and the Google GenAI SDK (`@google/genai`).

---

## 🌟 Features

* **DSA Instructor Chat (`/api/chat`)**: Specialised AI assistant powered by `gemini-2.5-flash` focused on Data Structures, Algorithms, and Competitive Programming.
* **Function & Tool Calling**: Integrated function declarations allowing Gemini to call local utilities:
  * `prime`: Primality testing algorithm.
  * `sum`: Numerical summation.
  * `executeCommand`: Autonomous terminal execution in `/api/chat/agent`.
* **Clean & Responsive UI**: Minimalist dark-themed chat interface with auto-scrolling, clear role-based bubbles, and keyboard shortcuts (`Enter` to send).
* **Optimized & Lightweight**: Zero bloated dependencies, fast compile times with Next.js Turbopack, and clean code structure.

---

## 📂 Project Structure

```text
genai-chatbot/
├── src/
│   ├── pages/
│   │   ├── index.tsx          # Main Chat Interface (Input, Output, Auto-Scroll)
│   │   ├── _app.tsx           # Next.js App Wrapper
│   │   ├── _document.tsx      # HTML Document Structure
│   │   └── api/
│   │       └── chat/
│   │           ├── index.ts   # DSA Chatbot API Route with Function Calling
│   │           └── agent.ts   # App-Builder AI Agent API Route
│   ├── functions/
│   │   ├── numerical/         # Math tool declarations (prime, sum)
│   │   ├── commandRunner/     # Shell execution tool declaration
│   │   └── index.ts
│   └── styles/
│       └── globals.css        # Tailwind CSS and global styling
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🔌 API Endpoints

### 1. DSA Instructor (`POST /api/chat`)
* Receives `{ history: Message[] }`
* Uses `gemini-2.5-flash` with system prompts and tool calling (`prime`, `sum`).
* Returns `{ message: string }`.

### 2. Autonomous Agent (`POST /api/chat/agent`)
* Server-side command execution agent with `executeCommand` function declaration.

---

## 🛠️ Getting Started

### 1. Environment Setup
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```
