import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is missing from .env');
}

const genAI = new GoogleGenAI({
  vertexai: false,
  apiKey: apiKey,
});

export default genAI;


export const generateChatStream = async (messages, onChunk) => {
  const history = messages.slice(0, -1).map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = genAI.chats.create({
    model: 'gemini-3.6-flash',
    history,
    config: {
      systemInstruction:
        "You are a helpful AI assistant. Answer clearly and naturally.",
    },
  });

  const stream = await chat.sendMessageStream({
    message: lastMessage.content,
  });

  for await (const chunk of stream) {
    if (chunk.text) {
      onChunk(chunk.text);
    }
  }
};