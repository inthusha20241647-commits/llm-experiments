import {createAgent} from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const model=new ChatOpenAI({
    model:'gpt-6-luna',
    temperature:1
})

const agent=new createAgent({
    model,
    tools:[],
    systemPrompt:"You are a helpful agent"
})

const response=await agent.invoke({
    messages:[
        {
            role:"user",
            content:"Tell me a joke about AI"
        }
    ]
})

console.log(response)

