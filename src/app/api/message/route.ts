import { db } from "@/db";

import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validator/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { NextRequest } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";

import { model } from "@/lib/genai";

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to a pdf file

  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { id: userId } = user;

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new Response("Not found", { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  // 1: vectorize message
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
  });

  const pineconeIndex = pinecone.index("answermypdf");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  const formattedPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  async function runChat(prompt: string) {
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [],
    });
    const result = await chatSession.sendMessage(prompt);

    const genResponse = result.response;
    const response = new Response(genResponse.text(), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    await db.message.create({
      data: {
        text: genResponse.text(),
        fileId,
        userId,
        isUserMessage: false,
      },
    });

    return response;
  }

  const prompt = `
        Use the following pieces of context (or previous conversation if needed) to answer the user's question in markdown format.
  
        \n----------------\n
        PREVIOUS CONVERSATION:
        ${formattedPrevMessages.map((message) => {
          if (message.role === "user") return `User: ${message.content}\n`;
          return `Assistant: ${message.content}\n`;
        })}
  
        \n----------------\n
        CONTEXT:
        ${results.map((r) => r.pageContent).join("\n\n")}
  
        USER INPUT: ${message}
        `;

  const response = await runChat(prompt);
  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
};
