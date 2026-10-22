import dotenv from 'dotenv'
dotenv.config()
import { GoogleGenAI } from "@google/genai";
import app from './src/app.js'
import connectDB from './src/config/db.js'


connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server is running on port ${process.env.PORT}`);
    }); 
})


// const ai = new GoogleGenAI({
//   vertexai: false,
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const response = await ai.models.generateContent({
//   model: 'gemini-3.8-flash',
//   contents: 'Say hello in one sentence.',
// });

// console.log(response.text);
