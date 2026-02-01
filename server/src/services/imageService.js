const openai = require('../config/openai');

/**
 * Generate an image based on the story scene
 */
async function generateImage(imagePrompt, genre) {
  // Enhance the prompt for better image generation
  const enhancedPrompt = `${genre} style illustration: ${imagePrompt}. Digital art, vibrant colors, cinematic composition, detailed.`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt: enhancedPrompt,
      n: 1,
      size: '512x512',
    });

    return response.data[0].url;
  } catch (error) {
    console.error('Image generation error:', error);
    // Return a placeholder if image generation fails
    return null;
  }
}

module.exports = {
  generateImage,
};
