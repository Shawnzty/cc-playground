const openai = require('../config/openai');

/**
 * Generate the initial story setup based on user preferences
 */
async function generateStoryStart(preferences) {
  const { language, genre, tone, customTheme, storyLength } = preferences;

  const systemPrompt = `You are a master storyteller creating an interactive adventure game.
You write in ${language}.
Genre: ${genre}
Tone: ${tone}
${customTheme ? `Theme/Setting: ${customTheme}` : ''}
Story length: approximately ${storyLength} steps.

Rules:
1. Write engaging, immersive narrative paragraphs (2-4 sentences)
2. Always provide exactly 3 choices for the player
3. Choices should be meaningful and lead to different story directions
4. Keep track of story continuity
5. Build tension and interest appropriate to the genre

Respond in JSON format:
{
  "storyText": "The narrative paragraph",
  "imagePrompt": "A detailed description for image generation (in English, regardless of story language)",
  "choices": [
    {"id": "A", "text": "Choice description"},
    {"id": "B", "text": "Choice description"},
    {"id": "C", "text": "Choice description"}
  ]
}`;

  const userPrompt = `Start a new ${genre} adventure story. Set the scene and present the first situation where the player must make a choice.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Continue the story based on player's choice
 */
async function continueStory(gameState, choiceId) {
  const { preferences, history, currentStep, maxSteps } = gameState;
  const { language, genre, tone, customTheme } = preferences;

  const isNearEnd = maxSteps !== 'unlimited' && currentStep >= maxSteps - 3;
  const isFinalStep = maxSteps !== 'unlimited' && currentStep >= maxSteps - 1;

  const systemPrompt = `You are a master storyteller continuing an interactive adventure game.
You write in ${language}.
Genre: ${genre}
Tone: ${tone}
${customTheme ? `Theme/Setting: ${customTheme}` : ''}
Current step: ${currentStep + 1}
${maxSteps !== 'unlimited' ? `Max steps: ${maxSteps}` : 'Unlimited story'}

Rules:
1. Write engaging, immersive narrative paragraphs (2-4 sentences)
2. ${isFinalStep ? 'This is the FINAL step - write a satisfying conclusion' : 'Provide exactly 3 choices for the player'}
3. Maintain story continuity with previous events
4. ${isNearEnd ? 'Start building towards a climax/conclusion' : 'Build tension and interest'}
5. Choices should be meaningful and consequential

Respond in JSON format:
{
  "storyText": "The narrative paragraph",
  "imagePrompt": "A detailed description for image generation (in English, regardless of story language)",
  ${isFinalStep ? '"isEnding": true' : '"choices": [{"id": "A", "text": "Choice description"}, {"id": "B", "text": "Choice description"}, {"id": "C", "text": "Choice description"}]'}
}`;

  // Build conversation history for context
  const messages = [
    { role: 'system', content: systemPrompt },
  ];

  // Add story history for context (last 5 exchanges to keep token count manageable)
  const recentHistory = history.slice(-5);
  for (const entry of recentHistory) {
    messages.push({ role: 'assistant', content: JSON.stringify(entry.response) });
    if (entry.choice) {
      messages.push({ role: 'user', content: `Player chose: ${entry.choice}` });
    }
  }

  // Add current choice
  const currentChoice = history[history.length - 1]?.response.choices?.find(c => c.id === choiceId);
  messages.push({
    role: 'user',
    content: `Player chose option ${choiceId}: "${currentChoice?.text || 'Continue'}"`
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * Continue the story based on player's custom choice
 */
async function continueStoryWithCustomChoice(gameState, customText) {
  const { preferences, history, currentStep, maxSteps } = gameState;
  const { language, genre, tone, customTheme } = preferences;

  const isNearEnd = maxSteps !== 'unlimited' && currentStep >= maxSteps - 3;
  const isFinalStep = maxSteps !== 'unlimited' && currentStep >= maxSteps - 1;

  const systemPrompt = `You are a master storyteller continuing an interactive adventure game.
You write in ${language}.
Genre: ${genre}
Tone: ${tone}
${customTheme ? `Theme/Setting: ${customTheme}` : ''}
Current step: ${currentStep + 1}
${maxSteps !== 'unlimited' ? `Max steps: ${maxSteps}` : 'Unlimited story'}

Rules:
1. Write engaging, immersive narrative paragraphs (2-4 sentences)
2. ${isFinalStep ? 'This is the FINAL step - write a satisfying conclusion' : 'Provide exactly 3 choices for the player'}
3. Maintain story continuity with previous events
4. ${isNearEnd ? 'Start building towards a climax/conclusion' : 'Build tension and interest'}
5. The player has made a CUSTOM choice - incorporate their action creatively into the story
6. Make the custom action feel natural and consequential within the story world

Respond in JSON format:
{
  "storyText": "The narrative paragraph",
  "imagePrompt": "A detailed description for image generation (in English, regardless of story language)",
  ${isFinalStep ? '"isEnding": true' : '"choices": [{"id": "A", "text": "Choice description"}, {"id": "B", "text": "Choice description"}, {"id": "C", "text": "Choice description"}]'}
}`;

  // Build conversation history for context
  const messages = [
    { role: 'system', content: systemPrompt },
  ];

  // Add story history for context (last 5 exchanges to keep token count manageable)
  const recentHistory = history.slice(-5);
  for (const entry of recentHistory) {
    messages.push({ role: 'assistant', content: JSON.stringify(entry.response) });
    if (entry.choice) {
      messages.push({ role: 'user', content: `Player chose: ${entry.choice}` });
    }
  }

  // Add custom choice
  messages.push({
    role: 'user',
    content: `Player's custom action: "${customText}"`
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = {
  generateStoryStart,
  continueStory,
  continueStoryWithCustomChoice,
};
