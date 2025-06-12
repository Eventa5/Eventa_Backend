import dayjs from "dayjs";
import OpenAI from "openai";
import { AI_CONFIG, SYSTEM_MESSAGES } from "../config/chat";
import type { ChatRequest, ChatResponse } from "../schemas/zod/chat.schema";
import { chatQueries, chatTools } from "./chatQueries";

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 處理聊天訊息的主要函數
export const processMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const { message } = request;

    // 調用 OpenAI API
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [
        {
          role: "system",
          content: SYSTEM_MESSAGES.main,
        },
        {
          role: "user",
          content: message,
        },
      ],
      tools: chatTools,
      tool_choice: "auto",
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens.main,
    });

    const responseMessage = completion.choices[0]?.message;
    let finalResponse = "";
    const sources: string[] = [];

    // 處理工具調用
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];

      if (toolCall.type === "function") {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments || "{}");

        // 執行對應的函數
        if (functionName && functionName in chatQueries) {
          try {
            const functionResult = await chatQueries[functionName](functionArgs);
            sources.push(functionName);

            // 再次調用 OpenAI 處理函數結果
            const secondCompletion = await openai.chat.completions.create({
              model: AI_CONFIG.model,
              messages: [
                {
                  role: "system",
                  content: SYSTEM_MESSAGES.resultProcessing,
                },
                {
                  role: "user",
                  content: message,
                },
                {
                  role: "assistant",
                  content: null,
                  tool_calls: responseMessage.tool_calls,
                },
                {
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: JSON.stringify(functionResult),
                },
              ],
              temperature: AI_CONFIG.temperature,
              max_tokens: AI_CONFIG.maxTokens.resultProcessing,
            });

            finalResponse =
              secondCompletion.choices[0]?.message?.content || "抱歉，我無法處理您的問題。";
          } catch (error) {
            console.error("Function execution error:", error);
            finalResponse = "抱歉，查詢數據時發生錯誤，請稍後再試。";
          }
        }
      }
    } else {
      finalResponse = responseMessage?.content || "抱歉，我無法理解您的問題。";
    }

    return {
      message: finalResponse,
      timestamp: dayjs().toISOString(),
      sources: sources.length > 0 ? sources : undefined,
    };
  } catch (error) {
    console.error("Chat service error:", error);
    throw new Error("處理聊天訊息時發生錯誤");
  }
};
