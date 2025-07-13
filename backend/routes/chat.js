/**
 * Chat Routes
 * Handles all chat-related endpoints
 */
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { ensureFullAuth } = require('../middleware/authMiddleware');
const S3Service = require('../services/s3Service');
const lessonContent = require('../data/lessonContent');

// Add local body-parser middleware for chat routes
// This is needed because the global body-parser is added after AdminJS setup
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Main chat page rendering
router.get('/', ensureFullAuth, (req, res) => {
  res.redirect('/chat');
});

router.get('/chat', ensureFullAuth, async (req, res) => {
  try {
    const lessonNumber = req.query.lesson;
    
    res.render('chat', {
      title: 'Hebrew Today | Learn Hebrew Step by Step',
      user: req.user || null,
      lessonNumber: lessonNumber || null
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    res.render('chat', {
      title: 'Hebrew Today | Learn Hebrew Step by Step',
      user: req.user || null,
      lessonNumber: null
    });
  }
});

// API routes for chat functionality

// Process a chat message (for streaming flow - doesn't generate response, just sets up for streaming)
router.post('/api/chat/message', ensureFullAuth, chatController.processMessage);

// Stream a chat response (accepts both GET and POST)
router.post('/api/chat/stream', ensureFullAuth, chatController.streamResponse);
router.get('/api/chat/stream', ensureFullAuth, chatController.streamResponse);

// Legacy routes for backward compatibility
router.post('/chat', ensureFullAuth, chatController.processMessage);
router.get('/stream', ensureFullAuth, chatController.streamResponse);

// Get all conversations (chat history)
router.get('/conversation_history', ensureFullAuth, chatController.getConversations);

// Get a specific conversation by ID
router.get('/get_conversation/:conversationId', ensureFullAuth, chatController.getConversation);

// Reset/clear the current conversation
router.post('/reset', ensureFullAuth, chatController.resetConversation);

// Lesson plan routes
router.get('/api/lesson/:lessonNumber/content', ensureFullAuth, async (req, res) => {
  try {
    const lessonNumber = parseInt(req.params.lessonNumber);
    
    // Validate lesson number (1-18)
    if (isNaN(lessonNumber) || lessonNumber < 1 || lessonNumber > 18) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid lesson number. Must be between 1 and 18.' 
      });
    }
    
    const lesson = lessonContent[lessonNumber];
    if (lesson) {
      res.json({
        success: true,
        lesson: lesson
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }
  } catch (error) {
    console.error('Error serving lesson content:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to retrieve lesson content'
    });
  }
});

router.get('/api/lesson/:lessonNumber/flashcard', ensureFullAuth, async (req, res) => {
  try {
    const lessonNumber = req.params.lessonNumber;
    
    // Validate lesson number (1-18)
    const lessonNum = parseInt(lessonNumber);
    if (isNaN(lessonNum) || lessonNum < 1 || lessonNum > 18) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid lesson number. Must be between 1 and 18.' 
      });
    }
    
    const s3Service = new S3Service();
    const result = await s3Service.getLessonFlashcard(lessonNumber);
    
    if (result.success) {
      res.set({
        'Content-Type': result.contentType,
        'Content-Length': result.contentLength,
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      });
      res.send(result.data);
    } else {
      if (result.error === 'FLASHCARD_NOT_FOUND') {
        res.status(404).json({
          success: false,
          error: 'FLASHCARD_NOT_FOUND',
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          message: result.message
        });
      }
    }
  } catch (error) {
    console.error('Error serving flashcard:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to retrieve flashcard'
    });
  }
});

module.exports = router;
