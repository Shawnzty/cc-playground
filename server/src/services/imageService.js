const openai = require('../config/openai');

/**
 * Generate an image based on the story scene
 */
async function generateImage(imagePrompt, genre) {
  // Enhance the prompt for better image generation
  const enhancedPrompt = `${genre} style illustration: ${imagePrompt}. Digital art, vibrant colors, cinematic composition, detailed.`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
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
