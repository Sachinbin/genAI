import { generateChatStream } from "../services/ai.service.js";

const normalizeMessages = (body = {}) => {
  const rawMessages = body.messages ?? body.message;

  if (Array.isArray(rawMessages)) {
    return rawMessages.filter(
      (message) =>
        message &&
        typeof message === "object" &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    );
  }

  if (rawMessages && typeof rawMessages === "object" && typeof rawMessages.content === "string") {
    return [rawMessages];
  }

  if (typeof rawMessages === "string" && rawMessages.trim().length > 0) {
    return [{ role: "user", content: rawMessages.trim() }];
  }

  return [];
};

export const chatWithAI = async (req, res) => {
  try {
    const messages = normalizeMessages(req.body);
    console.log("Received messages:", messages);

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        message: "Messages are required",
      });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    await generateChatStream(messages, (chunk) => {
      res.write(chunk);
    });

    res.end();
  } catch (error) {
    console.error("Gemini Error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "AI response failed",
      });
    }

    res.end();
  }
};