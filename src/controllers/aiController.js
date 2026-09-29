const geminiService = require('../services/geminiService');

/**
 * @desc    Generate an AI-powered answer for a question
 * @route   POST /api/ai/answer
 * @access  Private
 */
const generateAIAnswer = async (req, res, next) => {
  const { question } = req.body;

  try {
    const answer = await geminiService.generateAnswer(question);
    
    return res.json({
      success: true,
      answer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate a single FAQ question and answer pair based on a topic
 * @route   POST /api/ai/generate-faq
 * @access  Private
 */
const generateAIFAQ = async (req, res, next) => {
  const { topic } = req.body;

  try {
    const faqPair = await geminiService.generateFAQ(topic);
    
    return res.json({
      success: true,
      question: faqPair.question,
      answer: faqPair.answer,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateAIAnswer,
  generateAIFAQ,
};

// Lightweight status endpoint to check whether AI credentials are configured
const aiStatus = (req, res, next) => {
  try {
    const status = geminiService.checkCredentials();
    return res.json({ success: true, status });
  } catch (error) {
    next(error);
  }
};

module.exports.aiStatus = aiStatus;

/**
 * @desc Unauthenticated quick test to verify AI integration
 * @route GET /api/ai/test
 * @access Public
 */
const aiTest = async (req, res, next) => {
  try {
    const answer = await geminiService.generateAnswer('What is the capital of France?');
    return res.json({ success: true, answer });
  } catch (error) {
    next(error);
  }
};

module.exports.aiTest = aiTest;
