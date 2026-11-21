
import { OpenAI } from "openai";
import xlsx from "xlsx";
import readline from "readline";

const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
});

const workbook = xlsx.readFile("sales.xlsx");
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = xlsx.utils.sheet_to_json(worksheet);
const csvData = xlsx.utils.sheet_to_csv(worksheet);
const columns = Object.keys(jsonData[0]);

const systemPrompt = `You are a careful data analyst.
Answer ONLY using the data provided.
The columns are: ${columns.join(", ")}.
If the question cannot be answered from these columns, say so clearly.
Never guess or invent numbers, names, or columns.
Keep answers short.`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion() {
  rl.question(
    "\nAsk about the excel data (type 'exit' to quit): ",
    async (userQuestion) => {
      if (userQuestion.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      try {
        const response = await openai.chat.completions.create({
          model: "llama3.2",
          temperature: 0,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Data (CSV):
${csvData}

Question: ${userQuestion}`,
            },
          ],
        });

        console.log("\nAI Response:\n");
        console.log(response.choices[0].message.content);
      } catch (error) {
        console.log("Error:", error.message);
      }

      askQuestion();
    },
  );
}

askQuestion();
