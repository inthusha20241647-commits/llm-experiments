import xlsx from "xlsx";
import readline from "readline";

const workbook = xlsx.readFile("sales.xlsx");
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = xlsx.utils.sheet_to_json(worksheet);
const columns = Object.keys(jsonData[0]);
const csvData = xlsx.utils.sheet_to_csv(worksheet);

const systemPrompt = `You are a careful data analyst.
Answer ONLY using the data provided.
The columns are: ${columns.join(", ")}.
If the question cannot be answered from these columns, say so clearly.
 Never guess or invent numbers, names, or columns.
Keep answers short.

Data (CSV):
${csvData}`;

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
        const response = await fetch("http://localhost:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "qwen2.5:3b",
            stream: false,
            options: { temperature: 0, num_ctx: 8192 },
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userQuestion },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const result = await response.json();

        console.log("\nAI Response:\n");
        console.log(result.message.content);
      } catch (error) {
        console.log("Error:", error.message);
      }

      askQuestion();
    },
  );
}

askQuestion();