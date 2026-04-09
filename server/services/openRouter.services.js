import axios from "axios";

export const askAi = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is empty.");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",

          // ⭐ IMPORTANT (OpenRouter specific)
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "InterviewPilot",
        },
      },
    );

    console.log("FULL RESPONSE:", response.data); // 🔥 DEBUG

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error("AI returned empty response.");
    }

    return content;
  } catch (error) {
    console.error("❌ FULL ERROR:", error);

    // 🔥 Real error return karo
    if (error.response) {
      throw new Error(
        `OpenRouter Error: ${JSON.stringify(error.response.data)}`,
      );
    }

    throw new Error(error.message);
  }
};
