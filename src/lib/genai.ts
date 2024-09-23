// Make sure to include these imports:
import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
