const { GoogleGenAI } = require('@google/genai');

// Initialize the GoogleGenAI client.
// Supports two auth methods:
// 1) API Key: set `GOOGLE_API_KEY` or `GEMINI_API_KEY` in .env (recommended for simple setups)
// 2) Application Default Credentials (ADC): set `GOOGLE_APPLICATION_CREDENTIALS` to a
//    service account JSON file path (recommended for server/service deployments)
const getClient = () => {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'your_google_gemini_api_key_here') {
    return new GoogleGenAI({ apiKey });
  }

  // If a service account path is provided, rely on Google ADC (the client will pick it up)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new GoogleGenAI();
  }

  throw new Error(
    'No valid Gemini credentials found. Set `GOOGLE_API_KEY` (or `GEMINI_API_KEY`) or set `GOOGLE_APPLICATION_CREDENTIALS` to your service account JSON file path.'
  );
};

/**
 * Generates a concise answer for a user's question.
 * @param {string} question 
 * @returns {Promise<string>}
 */
const generateAnswer = async (question) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are a helpful assistant. Provide a clear, concise, and direct answer to the following question. Do not include introductory text like "Sure, here is the answer" or markdown formatting. Just return the answer itself.

Question: ${question}`,
    });

    if (!response || !response.text) {
      throw new Error('No response text received from Gemini API');
    }

    return response.text.trim();
  } catch (error) {
    console.error('Error in geminiService.generateAnswer:', error);
    throw new Error(`AI Answer Generation failed: ${error.message}`);
  }
};

/**
 * Generates a single FAQ question and answer pair for a topic.
 * @param {string} topic 
 * @returns {Promise<{question: string, answer: string}>}
 */
const generateFAQ = async (topic) => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a single frequently asked question (FAQ) and its comprehensive answer regarding the topic: "${topic}".`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            question: { 
              type: 'STRING', 
              description: 'A clear, common question that a user would ask about the topic.' 
            },
            answer: { 
              type: 'STRING', 
              description: 'A detailed, helpful, and accurate answer explaining the question.' 
            }
          },
          required: ['question', 'answer'],
        },
      },
    });

    if (!response || !response.text) {
      throw new Error('No response received from Gemini API');
    }

    // Parse the structured JSON response
    const faqPair = JSON.parse(response.text);
    return faqPair;
  } catch (error) {
    console.error('Error in geminiService.generateFAQ:', error);
    throw new Error(`AI FAQ Generation failed: ${error.message}`);
  }
};

module.exports = {
  generateAnswer,
  generateFAQ,
};

// Lightweight credentials check for health/status endpoints
const checkCredentials = () => {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'your_google_gemini_api_key_here') {
    return { ok: true, method: 'apiKey' };
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return { ok: true, method: 'adc', path: process.env.GOOGLE_APPLICATION_CREDENTIALS };
  }
  return { ok: false, message: 'No valid Gemini credentials found. Set GOOGLE_API_KEY or GOOGLE_APPLICATION_CREDENTIALS.' };
};

module.exports.checkCredentials = checkCredentials;
