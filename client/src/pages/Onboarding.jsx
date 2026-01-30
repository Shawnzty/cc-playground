import { useState } from 'react'
import { startGame } from '../services/api'

const LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'Chinese', label: '中文' },
  { id: 'Spanish', label: 'Español' },
  { id: 'French', label: 'Français' },
  { id: 'German', label: 'Deutsch' },
  { id: 'Japanese', label: '日本語' },
  { id: 'Korean', label: '한국어' },
]

const GENRES = [
  { id: 'Fantasy', label: 'Fantasy', emoji: '🐉' },
  { id: 'Sci-Fi', label: 'Sci-Fi', emoji: '🚀' },
  { id: 'Horror', label: 'Horror', emoji: '👻' },
  { id: 'Romance', label: 'Romance', emoji: '💕' },
  { id: 'Mystery', label: 'Mystery', emoji: '🔍' },
  { id: 'Adventure', label: 'Adventure', emoji: '🗺️' },
  { id: 'Historical', label: 'Historical', emoji: '🏰' },
  { id: 'Comedy', label: 'Comedy', emoji: '😄' },
]

const TONES = [
  { id: 'Light and Fun', label: 'Light & Fun', description: 'Casual, humorous, feel-good' },
  { id: 'Serious and Dark', label: 'Serious & Dark', description: 'Intense, dramatic, suspenseful' },
  { id: 'Epic and Grand', label: 'Epic & Grand', description: 'Heroic, sweeping, momentous' },
  { id: 'Whimsical', label: 'Whimsical', description: 'Playful, quirky, imaginative' },
]

const STORY_LENGTHS = [
  { id: 10, label: '~10 steps', description: 'Quick adventure' },
  { id: 20, label: '~20 steps', description: 'Standard journey' },
  { id: 40, label: '30-50 steps', description: 'Extended quest' },
  { id: 75, label: '50-100 steps', description: 'Epic saga' },
  { id: 'unlimited', label: 'Unlimited', description: 'Never-ending story' },
]

function Onboarding({ onStart }) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preferences, setPreferences] = useState({
    language: 'English',
    genre: '',
    tone: '',
    customTheme: '',
    storyLength: 20,
  })

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const canProceed = () => {
    switch (step) {
      case 0: return preferences.language
      case 1: return preferences.genre
      case 2: return preferences.tone
      case 3: return preferences.storyLength
      case 4: return true // Custom theme is optional
      default: return false
    }
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleStart = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await startGame(preferences)
      onStart(preferences, response)
    } catch (err) {
      setError(err.message || 'Failed to start game')
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="onboarding-step">
            <h2>Choose Your Language</h2>
            <p className="step-description">Select the language for your story</p>
            <div className="options-grid language-grid">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  className={`option-btn ${preferences.language === lang.id ? 'selected' : ''}`}
                  onClick={() => updatePreference('language', lang.id)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="onboarding-step">
            <h2>Choose Your Genre</h2>
            <p className="step-description">What kind of story do you want to experience?</p>
            <div className="options-grid genre-grid">
              {GENRES.map(genre => (
                <button
                  key={genre.id}
                  className={`option-btn genre-btn ${preferences.genre === genre.id ? 'selected' : ''}`}
                  onClick={() => updatePreference('genre', genre.id)}
                >
                  <span className="genre-emoji">{genre.emoji}</span>
                  <span>{genre.label}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="onboarding-step">
            <h2>Choose Your Tone</h2>
            <p className="step-description">Set the mood of your adventure</p>
            <div className="options-list">
              {TONES.map(tone => (
                <button
                  key={tone.id}
                  className={`option-btn tone-btn ${preferences.tone === tone.id ? 'selected' : ''}`}
                  onClick={() => updatePreference('tone', tone.id)}
                >
                  <span className="tone-label">{tone.label}</span>
                  <span className="tone-description">{tone.description}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="onboarding-step">
            <h2>Story Length</h2>
            <p className="step-description">How long should your adventure be?</p>
            <div className="options-list">
              {STORY_LENGTHS.map(length => (
                <button
                  key={length.id}
                  className={`option-btn length-btn ${preferences.storyLength === length.id ? 'selected' : ''}`}
                  onClick={() => updatePreference('storyLength', length.id)}
                >
                  <span className="length-label">{length.label}</span>
                  <span className="length-description">{length.description}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="onboarding-step">
            <h2>Custom Theme (Optional)</h2>
            <p className="step-description">Add specific elements you'd like in your story</p>
            <input
              type="text"
              className="custom-input"
              placeholder="e.g., pirates, dragons, time travel, underwater city..."
              value={preferences.customTheme}
              onChange={(e) => updatePreference('customTheme', e.target.value)}
            />
            <div className="summary">
              <h3>Your Adventure Settings</h3>
              <ul>
                <li><strong>Language:</strong> {preferences.language}</li>
                <li><strong>Genre:</strong> {preferences.genre}</li>
                <li><strong>Tone:</strong> {preferences.tone}</li>
                <li><strong>Length:</strong> {STORY_LENGTHS.find(l => l.id === preferences.storyLength)?.label}</li>
                {preferences.customTheme && <li><strong>Theme:</strong> {preferences.customTheme}</li>}
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding-header">
        <h1>AI Story Adventure</h1>
        <p>Create your own interactive story with AI-generated text and images</p>
      </div>

      <div className="progress-bar">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`progress-step ${i <= step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
          />
        ))}
      </div>

      <div className="onboarding-content">
        {renderStep()}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="onboarding-actions">
        {step > 0 && (
          <button className="btn btn-secondary" onClick={handleBack} disabled={loading}>
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next
          </button>
        ) : (
          <button
            className="btn btn-primary btn-start"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? 'Creating Your Adventure...' : 'Begin Adventure'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Onboarding
