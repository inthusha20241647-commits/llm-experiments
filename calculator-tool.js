import {createAgent,HumanMessage,AIMessage,SystemMessage} from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import {tool} from "@langchain/core/tools";
import {z} from "zod";

dotenv.config();

const model=new ChatOpenAI({
    model:'gpt-6-luna',
    reasoning:{effort:"none"}
})

const calculatorTool=tool(async({a,b})=>{
    return `a+b=${a+b}`
},
{
    name:"calculator",
    description:"Adding two numbers",
    schema:z.object({
        a:z.number(),
        b:z.number()
    })
}
)

const agent=new createAgent({
    model,
    tools:[calculatorTool],
    systemPrompt:"You are a helpful agent"
})

const response=await agent.invoke({
    messages:[
        new HumanMessage("What is 5+3?")
    ]
})

console.log(response)

