import { createAgent, HumanMessage } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
  model: "gpt-6-luna",
  reasoning: { effort: "none" },
});

const addTool = tool(
  async ({ a, b }) => `${a} + ${b} = ${a + b}`,
  {
    name: "add",
    description: "Adds two numbers and returns the sum",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const cityCoordinates = {
  bangalore: { latitude: 12.97, longitude: 77.59 },
  chennai: { latitude: 13.08, longitude: 80.27 },
  mumbai: { latitude: 19.07, longitude: 72.87 },
};

const weatherTool = tool(
  async ({ city }) => {
    const location = cityCoordinates[city.toLowerCase()];

    if (!location) {
      return `Weather data not available for ${city}`;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`;

    const response = await fetch(url);
    if (!response.ok) {
      return `Could not fetch weather for ${city} (HTTP ${response.status})`;
    }

    const data = await response.json();
    return `Current temperature in ${city} is ${data.current_weather.temperature}°C`;
  },
  {
    name: "weather",
    description: "Gets the current weather for a city (bangalore, chennai or mumbai)",
    schema: z.object({
      city: z.string().describe("City name, for example chennai"),
    }),
  }
);

const agent = createAgent({
  model,
  tools: [addTool, weatherTool],
  systemPrompt: "You are a helpful agent. Use the tools when they apply.",
});

const response = await agent.invoke({
  messages: [new HumanMessage("What is the current weather of chennai?")],
});

console.log(response.messages.at(-1).content);