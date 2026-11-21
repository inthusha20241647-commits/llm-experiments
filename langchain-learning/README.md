# LangChain Learning: Building AI Agents with Tools (Node.js)

Three small scripts that show how an AI agent goes from "just chatting" to "doing things" by calling tools. Each script builds on the one before it.

> **Status:** learning project, not production code.

---

## What is LangChain?

**LangChain** is an open-source framework that helps you build applications around a Large Language Model (LLM).

An LLM like GPT, Llama or Gemini is very good at understanding and writing text, but on its own it has limits:

- It can only take text in and give text out.
- It can't look up live data (like today's weather).
- It can't run code or reliably do math.
- It forgets everything between requests.

LangChain fills those gaps. It gives you ready-made building blocks to connect an LLM to the outside world.

| Building block | What it does |
|---|---|
| **Model** | Connects to an LLM (OpenAI, Ollama, Gemini and more) behind one common interface |
| **Tool** | A normal function the LLM can ask your code to run (a calculator, a weather lookup) |
| **Agent** | An LLM that decides *which tool to use and when*, then uses the result to answer |
| **Messages** | A standard way to represent the conversation (user, AI, system) |

**Analogy:** the LLM is the brain, tools are its hands, and LangChain is the nervous system that connects them.

**Why use it?**
- Switch between models by changing one line of code.
- Add abilities to an LLM by writing small functions instead of complex prompts.
- Build agents that take actions, not only answer questions.

---

## What's in this project

| File | What it demonstrates |
|---|---|
| `agent.js` | The simplest agent: no tools, just a model answering a prompt |
| `calculator-tool.js` | An agent with one tool (`add`) that does exact addition |
| `weather-calculatortool.js` | An agent with two tools: `add` and a live `weather` lookup |

---

## How the agent works

```
Your question
     │
     ▼
   Agent ──► LLM decides: "Do I need a tool?"
     │              │
     │         yes  ▼
     │        Calls the tool (your JavaScript function)
     │              │
     │              ▼
     │        Tool returns a result
     │              │
     ▼              ▼
   LLM reads the result and writes the final answer
```

For example, when you ask "What is the current weather of Chennai?", the model does not guess. It calls the `weather` tool, which fetches real data, and then it writes the answer using that data.

---

## Getting Started

### Requirements
- Node.js 18 or newer
- An OpenAI API key (the scripts use `ChatOpenAI`)

### Setup

    git clone https://github.com/inthusha20241647-commits/llm-experiments.git
    cd llm-experiments/langchain-learning
    npm install langchain @langchain/core @langchain/openai zod dotenv

1. Make sure `package.json` includes `"type": "module"`.
2. Create a `.env` file in this folder:

       OPENAI_API_KEY=your-key-here

3. Never commit `.env`. It is listed in `.gitignore`.

### Run

    node agent.js
    node calculator-tool.js
    node weather-calculatortool.js

---

## Example

Question: `What is the current weather of chennai?`

The agent calls the `weather` tool and replies with something like:

> The current temperature in Chennai is 29°C.

(The number will differ each time, because it comes from live data.)

---

## Code highlights

**Defining a tool** with a name, a description the model reads to decide when to use it, and a schema describing its inputs:

```js
const addTool = tool(
  async ({ a, b }) => `${a} + ${b} = ${a + b}`,
  {
    name: "add",
    description: "Adds two numbers and returns the sum",
    schema: z.object({ a: z.number(), b: z.number() }),
  }
);
```

**Creating the agent** from a model and a list of tools:

```js
const agent = createAgent({
  model,
  tools: [addTool, weatherTool],
  systemPrompt: "You are a helpful agent. Use the tools when they apply.",
});
```

---

## Things I learned

- **Tools make answers reliable.** The model calls code for exact math and live data instead of guessing.
- **Clear tool names and descriptions matter.** The model chooses tools by reading them.
- **Reasoning models and tools.** `gpt-6-luna` returned an error when function tools were combined with reasoning on the chat completions endpoint. Setting `reasoning: { effort: "none" }` fixed it.
- **Weather data** comes from [Open-Meteo](https://open-meteo.com/), which is free and needs no API key.

---

## Limitations

- The weather tool only knows three cities: Bangalore, Chennai and Mumbai.
- The `add` tool only adds two numbers.
- Requires an OpenAI API key with available credits. The model can be swapped for a local one (for example with `@langchain/ollama`) by changing the `model` line.

---

## Next steps

- [ ] Look up any city with Open-Meteo's geocoding API
- [ ] Add subtract, multiply and divide tools
- [ ] Switch to a free local model with `@langchain/ollama`
- [ ] Build an agent that reads an Excel file and computes sums in code (ties in with my [Excel chat project](../excel-data-analysis))

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?logo=langchain&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)
