import {GoogleGenAI} from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

export const generateRoadmap = async(req,res)=>{
    const {goal} = req.body;
    const prompt = `Generate a concise learning roadmap for "${goal}". Include only the sections that are relevant to the topic. Each section should have a heading and a description.

    Example outputs:

    heading: frontend
    desc: html, css, js, react

    heading: backend
    desc: nodejs, expressjs

    heading: database
    desc: mongodb

    Return only the relevant headings and descriptions, with no extra text`

    const systemInstruction = `You are an AI assistant generating learning roadmaps. Return output exactly as requested with headings and descriptions only.`

    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [prompt],
          systemInstruction,
        });
    
        const text =
          response.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const lines = text.split("\n").filter(Boolean);
    
        const roadmap = [];
        for (let i = 0; i < lines.length; i += 2) {
            const heading = lines[i]?.split(":")[1]?.trim();
            const desc = lines[i + 1]?.split(":")[1]?.trim();
            if (heading && desc) {
                roadmap.push({ heading, desc });
            }
        }
    
        res.json(roadmap);
      } catch (error) {
        console.error("Roadmap generation error:", error);
        res.status(500).json({ error: "Failed to generate roadmap." });
      }
}