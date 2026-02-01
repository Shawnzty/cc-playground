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
      summary: storyResponse.summary,
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
      summary: storyResponse.summary,
      imageUrl,
      choices: storyResponse.choices || [],
      isEnding: storyResponse.isEnding || false,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Make a custom choice and continue the story
 * POST /api/game/custom-choice
 */
router.post('/custom-choice', async (req, res, next) => {
  try {
    const { sessionId, customText } = req.body;

    if (!sessionId || !customText) {
      return res.status(400).json({ error: 'Missing sessionId or customText' });
    }

    const gameState = gameSessions.get(sessionId);
    if (!gameState) {
      return res.status(404).json({ error: 'Game session not found' });
    }

    // Update the last history entry with the custom choice made
    gameState.history[gameState.history.length - 1].choice = `Custom: ${customText}`;

    // Generate next story segment with custom choice
    const storyResponse = await storyService.continueStoryWithCustomChoice(gameState, customText);

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
      summary: storyResponse.summary,
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
 * Get game history with summaries for rollback menu
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
      summary: h.response.summary || h.response.storyText.substring(0, 50) + '...',
      imageUrl: h.imageUrl,
      choiceMade: h.choice,
      choices: h.response.choices,
    })),
  });
});

/**
 * Rollback to a specific step
 * POST /api/game/rollback
 */
router.post('/rollback', (req, res) => {
  const { sessionId, targetStep } = req.body;

  if (!sessionId || !targetStep) {
    return res.status(400).json({ error: 'Missing sessionId or targetStep' });
  }

  const gameState = gameSessions.get(sessionId);
  if (!gameState) {
    return res.status(404).json({ error: 'Game session not found' });
  }

  // Validate target step
  if (targetStep < 1 || targetStep > gameState.currentStep) {
    return res.status(400).json({ error: 'Invalid target step' });
  }

  // Truncate history to target step
  gameState.history = gameState.history.slice(0, targetStep);
  gameState.currentStep = targetStep;

  // Clear the choice on the last step (so user can choose again)
  gameState.history[gameState.history.length - 1].choice = null;

  gameState.updatedAt = new Date().toISOString();

  const currentHistory = gameState.history[gameState.history.length - 1];

  res.json({
    sessionId,
    step: gameState.currentStep,
    maxSteps: gameState.maxSteps,
    storyText: currentHistory.response.storyText,
    summary: currentHistory.response.summary,
    imageUrl: currentHistory.imageUrl,
    choices: currentHistory.response.choices || [],
    isEnding: currentHistory.response.isEnding || false,
  });
});

// Helper function to generate session IDs
function generateSessionId() {
  return 'game_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;
