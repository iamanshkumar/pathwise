import { GoogleGenAI } from "@google/genai";
import axios from "axios";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const YT_API_KEY = process.env.YOUTUBE_API_KEY;

export const getVideos = async (req, res) => {
  const { goal } = req.body;

  const prompt = `Generate YouTube video search queries for learning "${goal}".

For each topic relevant to the goal, return 3–5 high-quality beginner-friendly YouTube search queries.

Format strictly like this:
heading: <section heading>
videos:
- <search query 1>
- <search query 2>
- <search query 3>`;

  const systemInstruction = `You are an AI assistant generating video search queries for YouTube. 
Output only in the requested format. Do not add explanations or extra text.`;

  try {
    // 1. Get search queries from Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      response.candidates?.[0]?.content?.[0]?.text ||
      "";

    const lines = text.split("\n").filter(Boolean);

    const roadmapVideos = [];
    let currentHeading = null;
    let currentList = [];

    for (let line of lines) {
      if (line.startsWith("heading:")) {
        if (currentHeading) {
          roadmapVideos.push({ heading: currentHeading, queries: currentList });
        }
        currentHeading = line.split(":")[1].trim();
        currentList = [];
      } else if (line.startsWith("-")) {
        currentList.push(line.replace("-", "").trim());
      }
    }

    if (currentHeading) {
      roadmapVideos.push({ heading: currentHeading, queries: currentList });
    }

    // 2. Fetch YouTube results for each query
    const finalData = [];

    for (const section of roadmapVideos) {
      const videos = [];

      for (const query of section.queries) {
        try {
          const ytRes = await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
              part: "snippet",
              q: query,
              type: "video",
              maxResults: 1, // get top 1 video per query
              key: YT_API_KEY,
            },
          });

          const item = ytRes.data.items[0];
          if (item) {
            videos.push({
              title: item.snippet.title,
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              thumbnail: item.snippet.thumbnails.high.url,
            });
          }
        } catch (err) {
          console.error("YouTube fetch error:", err.message);
        }
      }

      finalData.push({
        heading: section.heading,
        videos,
      });
    }

    res.json(finalData);
  } catch (error) {
    console.error("Video generation error:", error?.response?.data || error);
    res.status(500).json({ error: "Failed to generate video queries." });
  }
};
