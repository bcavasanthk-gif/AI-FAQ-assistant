require('dotenv').config();
const gemini = require('./src/services/geminiService');

(async () => {
  try {
    const resp = await gemini.generateAnswer('What is the capital of France?');
    console.log('AI response:', resp);
  } catch (err) {
    console.error('Error calling Gemini service:', err.message || err);
    process.exit(1);
  }
})();