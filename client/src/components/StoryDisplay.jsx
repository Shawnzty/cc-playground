import { useState, useEffect, useRef } from 'react'

function StoryDisplay({ storyText, imageUrl, isLoading }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const prevTextRef = useRef('')

  // Typing animation effect
  useEffect(() => {
    // Only animate if text changed (new content)
    if (storyText !== prevTextRef.current && storyText) {
      prevTextRef.current = storyText
      setDisplayedText('')
      setIsTyping(true)
      setImageLoaded(false)
      setShowImage(false)

      let index = 0
      const speed = 20 // ms per character

      const timer = setInterval(() => {
        if (index < storyText.length) {
          setDisplayedText(storyText.slice(0, index + 1))
          index++
        } else {
          clearInterval(timer)
          setIsTyping(false)
        }
      }, speed)

      return () => clearInterval(timer)
    }
  }, [storyText])

  // Handle image load - fade in after loaded
  const handleImageLoad = () => {
    setImageLoaded(true)
    // Small delay before showing to ensure smooth fade
    setTimeout(() => setShowImage(true), 50)
  }

  // Skip typing animation on click
  const handleTextClick = () => {
    if (isTyping) {
      setDisplayedText(storyText)
      setIsTyping(false)
    }
  }

  return (
    <div className={`story-display ${isLoading ? 'loading' : ''}`}>
      <div className={`story-image-container ${showImage ? 'image-visible' : ''}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Story scene"
            className={`story-image ${showImage ? 'fade-in' : ''}`}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="image-placeholder">
            <span>Image loading...</span>
          </div>
        )}
        {(isLoading || !imageLoaded) && (
          <div className="image-loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <div className="story-text-container" onClick={handleTextClick}>
        <p className="story-text">
          {displayedText}
          {isTyping && <span className="typing-cursor">|</span>}
        </p>
        {isTyping && (
          <p className="skip-hint">Tap to skip</p>
        )}
      </div>
    </div>
  )
}

export default StoryDisplay
