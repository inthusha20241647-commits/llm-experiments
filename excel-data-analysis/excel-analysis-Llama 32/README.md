# Excel Chat with Ollama: A Small-Model Reliability Experiment

A lightweight Node.js CLI that answers plain-English questions about an Excel sheet using a **local LLM (Llama 3.2, 3B)** through [Ollama](https://ollama.com). No API key, no cost, and no data leaves your machine.

> **Note:** This is an educational experiment, not a production analytics tool. LLMs predict text; they do not execute arithmetic or queries. Always verify answers against the source spreadsheet.

## Motivation

After running out of hosted API credits, I switched to a local model through Ollama's OpenAI-compatible endpoint (`http://localhost:11434/v1`), changing only the `baseURL`. I then tested how far a small model can be trusted with tabular data, using `temperature: 0` and a strict system prompt.

## How It Works

1. Reads the first worksheet of `sales.xlsx` with the `xlsx` library.
2. Converts it to CSV and extracts the column names.
3. Sends the CSV, the column names, refusal instructions, and your question to `llama3.2` (`temperature: 0`).
4. Prints the answer and repeats until you type `exit`.

## Setup

**Prerequisites:** Node.js 18+ and Ollama installed and running.

```bash
ollama pull llama3.2
git clone https://github.com/inthusha20241647-commits/excel-chat-ollama.git
cd excel-chat-ollama
npm install
node index.js
```

Notes:
- `package.json` must contain `"type": "module"` because the code uses `import`.
- Put your spreadsheet in the project folder as `sales.xlsx` (sample columns: `Name`, `Sales`, `Region`, `Month`).
- Don't commit spreadsheets with real or private data.

## Results

Tested on a 7-row sheet with about 30 questions.

| Category | Example | Result |
|---|---|---|
| Direct lookup | "Which region is Suwetha in?" | x/4 |
| Filtering and listing | "Who sold in January?" | x/4 |
| Calculations | "Total sales in March?" | x/6 |
| Trick questions | "Which product sold the most units?" | x/5 refused |

### Observations

- **Lookups were accurate** when the answer sat in a single row.
- **Filtering was incomplete.** "Who sold in January?" returned 2 names instead of 3.
- **Calculations were inconsistent.** Some correct, some wrong.
- **Missing data was sometimes invented.** The sheet has no product or unit columns, yet an early version answered with a made-up figure.
- **Wording affected answers.** Rephrasing could change the result.

### Why this happens

- The model predicts likely text, so sums are plausible guesses, not calculations.
- Listing every match across rows is a recall task, and small models drop items.
- Models tend to produce an answer rather than say "this isn't in the data".
- The sheet is sent as flat text, so tracking values per row is error-prone.
- Ollama's default context window is small, so large sheets can be silently truncated.

## Limitations

Llama 3.2 (3B) is fine for demos and offline learning, but not for tasks where numbers must be correct. It rarely signals uncertainty, so a wrong answer looks as confident as a right one.

## Better Options

- **Larger local models** (for example `qwen2.5:7b`, `llama3.1:8b`, `gemma2:9b`): usually better at reasoning, but need more RAM and are slower.
- **Hosted models**: stronger at tabular reasoning, with a small code change.
- **Recommended architecture:** have the model output a structured operation (e.g. `{"op":"sum","column":"Sales","filter":{"Month":"January"}}`), run it in code, then phrase the result. Code computes, the model explains.

## Roadmap

- [ ] Pre-compute totals and group lists in code
- [ ] Tool calling with code-executed operations
- [ ] Compare Llama 3.2 3B against an 8B model and a hosted model
- [ ] Automated test script with expected answers

## Tech Stack

Node.js, `xlsx`, OpenAI SDK (pointed at Ollama), Llama 3.2 (3B)
