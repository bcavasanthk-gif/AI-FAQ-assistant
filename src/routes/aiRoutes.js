const express = require('express');
const router = express.Router();
const {
  generateAIAnswer,
  generateAIFAQ,
  aiStatus,
  aiTest,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateAIAnswer,
  validateAIFaq,
} = require('../middleware/validationMiddleware');

// Protected routes to prevent API overuse/abuse
router.post('/answer', protect, validateAIAnswer, generateAIAnswer);
router.post('/generate-faq', protect, validateAIFaq, generateAIFAQ);

// Public status route to verify AI credentials (no auth required)
router.get('/status', aiStatus);

// Public quick test route (no auth) — returns a sample AI answer
router.get('/test', aiTest);

module.exports = router;
