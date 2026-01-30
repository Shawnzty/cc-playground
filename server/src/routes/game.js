const express = require('express');
const router = express.Router();
const storyService = require('../services/storyService');
const imageService = require('../services/imageService');

// In-memory game sessions (will be replaced with database later)
const gameSessions = new Map();

/**
 * Start a new game
 * POST /api/game/start
 */
router.post('/start', async (req, res, next) => {
  try {
    const { preferences } = req.body;

    // Validate preferences
    if (!preferences || !preferences.language || !preferences.genre || !preferences.tone) {
      return res.status(400).json({ error: 'Missing required preferences' });
    }

    // Generate initial story
    const storyResponse = await storyService.generateStoryStart(preferences);

    // Generate image
    const imageUrl = await imageService.generateImage(storyResponse.imagePrompt, preferences.genre);

    // Create game session
    const sessionId = generateSessionId();
    const gameState = {
      id: sessionId,
      preferences,
      currentStep: 1,
      maxSteps: preferences.storyLength,
      history: [{
        step: 1,
        response: storyResponse,
        imageUrl,
        choice: null,
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    gameSessions.set(sessionId, gameState);

    res.json({
      sessionId,
      step: 1,
      maxSteps: preferences.storyLength,
      storyText: storyResponse.storyText,
      imageUrl,
      choices: storyResponse.choices,
      isEnding: false,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Make a choice and continue the story
 * POST /api/game/choose
 */
router.post('/choose', async (req, res, next) => {
  try {
    const { sessionId, choiceId } = req.body;

    if (!sessionId || !choiceId) {
      return res.status(400).json({ error: 'Missing sessionId or choiceId' });
    }

    const gameState = gameSessions.get(sessionId);
    if (!gameState) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    // Update the last history entry with the choice made
    gameState.history[gameState.history.length - 1].choice = choiceId;

    // Generate next story segment
    const storyResponse = await storyService.continueStory(gameState, choiceId);

    // Generate image
    const imageUrl = await imageService.generateImage(storyResponse.imagePrompt, gameState.preferences.genre);

    // Update game state
    gameState.currentStep += 1;
    gameState.history.push({
      step: gameState.currentStep,
      response: storyResponse,
      imageUrl,
      choice: null,
    });
    gameState.updatedAt = new Date().toISOString();

    res.json({
      sessionId,
      step: gameState.currentStep,
      maxSteps: gameState.maxSteps,
      storyText: storyResponse.storyText,
      imageUrl,
      choices: storyResponse.choices || [],
      isEnding: storyResponse.isEnding || false,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get current game state
 * GET /api/game/:sessionId
 */
router.get('/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const gameState = gameSessions.get(sessionId);

  if (!gameState) {
    return res.status(404).json({ error: 'Game session not found' });
  }

  const currentHistory = gameState.history[gameState.history.length - 1];

  res.json({
    sessionId,
    step: gameState.currentStep,
    maxSteps: gameState.maxSteps,
    storyText: currentHistory.response.storyText,
    imageUrl: currentHistory.imageUrl,
    choices: currentHistory.response.choices || [],
    isEnding: currentHistory.response.isEnding || false,
    preferences: gameState.preferences,
  });
});

/**
 * Get game history
 * GET /api/game/:sessionId/history
 */
router.get('/:sessionId/history', (req, res) => {
  const { sessionId } = req.params;
  const gameState = gameSessions.get(sessionId);

  if (!gameState) {
    return res.status(404).json({ error: 'Game session not found' });
  }

  res.json({
    sessionId,
    history: gameState.history.map(h => ({
      step: h.step,
      storyText: h.response.storyText,
      imageUrl: h.imageUrl,
      choiceMade: h.choice,
      choices: h.response.choices,
    })),
  });
});

// Helper function to generate session IDs
function generateSessionId() {
  return 'game_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;
