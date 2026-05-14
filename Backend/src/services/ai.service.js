const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENAI_API_KEY
);

async function invokeGeminiAi(retries = 3) {

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      "Hello Gemini! Explain what an interview is."
    );

    console.log(result.response.text());

  } catch (error) {

    console.log("Gemini Error:");
    console.log(error.message);

    if (retries > 0) {

      console.log(`Retrying... (${retries})`);

      setTimeout(() => {
        invokeGeminiAi(retries - 1);
      }, 3000);

    }

  }
}

module.exports = invokeGeminiAi;