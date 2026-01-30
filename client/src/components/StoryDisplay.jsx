function StoryDisplay({ storyText, imageUrl, isLoading }) {
  return (
    <div className={`story-display ${isLoading ? 'loading' : ''}`}>
      <div className="story-image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Story scene"
            className="story-image"
          />
        ) : (
          <div className="image-placeholder">
            <span>Image loading...</span>
          </div>
        )}
        {isLoading && (
          <div className="image-loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <div className="story-text-container">
        <p className="story-text">{storyText}</p>
      </div>
    </div>
  )
}

export default StoryDisplay
