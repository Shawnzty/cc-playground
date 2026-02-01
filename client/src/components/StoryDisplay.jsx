import { useState, useEffect, useRef } from 'react'

function StoryDisplay({ storyText, imageUrl, isLoading }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const prevTextRef = useRef('')

  // Typing animation effect
  useEffect(() => {
    // Only animate if text changed (new content)
    if (storyText !== prevTextRef.current && storyText) {
      prevTextRef.current = storyText
      setDisplayedText('')
      setIsTyping(true)

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

  // Skip typing animation on click
  const handleTextClick = () => {
    if (isTyping) {
      setDisplayedText(storyText)
      setIsTyping(false)
    }
  }

  // Show skeleton when loading
  if (isLoading) {
    return (
      <div className="story-display loading">
        {/* Image skeleton */}
        <div className="story-image-container skeleton-container">
          <div className="skeleton-image">
            <div className="quill-loader">
              <svg viewBox="0 0 50 50" className="quill-svg">
                <path
                  className="quill-pen"
                  d="M10 40 L25 10 L30 15 L15 45 Z M25 10 Q35 5 45 8 L30 15 Z"
                  fill="currentColor"
                />
                <path
                  className="quill-line"
                  d="M12 42 Q20 38 35 42"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span className="loader-text">Writing your story...</span>
            </div>
          </div>
        </div>

        {/* Text skeleton */}
        <div className="story-text-container skeleton-container">
          <div className="skeleton-text">
            <div className="skeleton-line" style={{ width: '95%' }}></div>
            <div className="skeleton-line" style={{ width: '88%' }}></div>
            <div className="skeleton-line" style={{ width: '92%' }}></div>
            <div className="skeleton-line" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="story-display">
      <div className="story-image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Story scene"
            className="story-image"
          />
        ) : (
          <div className="image-placeholder">
            <div className="quill-loader">
              <svg viewBox="0 0 50 50" className="quill-svg">
                <path
                  className="quill-pen"
                  d="M10 40 L25 10 L30 15 L15 45 Z M25 10 Q35 5 45 8 L30 15 Z"
                  fill="currentColor"
                />
                <path
                  className="quill-line"
                  d="M12 42 Q20 38 35 42"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span className="loader-text">Painting the scene...</span>
            </div>
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
