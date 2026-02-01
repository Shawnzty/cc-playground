import { useState } from 'react'
import { startGame } from '../services/api'
import { t } from '../services/translations'

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
  { id: 'Fantasy', key: 'fantasy', emoji: '🐉' },
  { id: 'Sci-Fi', key: 'sciFi', emoji: '🚀' },
  { id: 'Horror', key: 'horror', emoji: '👻' },
  { id: 'Romance', key: 'romance', emoji: '💕' },
  { id: 'Mystery', key: 'mystery', emoji: '🔍' },
  { id: 'Adventure', key: 'adventure', emoji: '🗺️' },
  { id: 'Historical', key: 'historical', emoji: '🏰' },
  { id: 'Comedy', key: 'comedy', emoji: '😄' },
]

const TONES = [
  { id: 'Light and Fun', labelKey: 'lightFun', descKey: 'lightFunDesc' },
  { id: 'Serious and Dark', labelKey: 'seriousDark', descKey: 'seriousDarkDesc' },
  { id: 'Epic and Grand', labelKey: 'epicGrand', descKey: 'epicGrandDesc' },
  { id: 'Whimsical', labelKey: 'whimsical', descKey: 'whimsicalDesc' },
]

const STORY_LENGTHS = [
  { id: 10, labelKey: 'short', descKey: 'shortDesc' },
  { id: 35, labelKey: 'medium', descKey: 'mediumDesc' },
  { id: 75, labelKey: 'long', descKey: 'longDesc' },
  { id: 'unlimited', labelKey: 'unlimited', descKey: 'unlimitedDesc' },
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
    storyLength: 35,
  })

  const lang = preferences.language

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const canProceed = () => {
    switch (step) {
      case 0: return preferences.language
      case 1: return preferences.genre
      case 2: return preferences.tone
      case 3: return preferences.storyLength
      case 4: return true
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

  const getLengthLabel = (id) => {
    const length = STORY_LENGTHS.find(l => l.id === id)
    return length ? t(lang, length.labelKey) : ''
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="onboarding-step">
            <h2>{t(lang, 'chooseLanguage')}</h2>
            <p className="step-description">{t(lang, 'chooseLanguageDesc')}</p>
            <div className="options-grid language-grid">
              {LANGUAGES.map(item => (
                <button
                  key={item.id}
                  className={`option-btn ${preferences.language === item.id ? 'selected' : ''}`}
                  onClick={() => updatePreference('language', item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="onboarding-step">
            <h2>{t(lang, 'chooseGenre')}</h2>
            <p className="step-description">{t(lang, 'chooseGenreDesc')}</p>
            <div className="options-grid genre-grid">
              {GENRES.map(genre => (
                <button
                  key={genre.id}
                  className={`option-btn genre-btn ${preferences.genre === genre.id ? 'selected' : ''}`}
                  onClick={() => updatePreference('genre', genre.id)}
                >
                  <span className="genre-emoji">{genre.emoji}</span>
                  <span>{t(lang, genre.key)}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="onboarding-step">
            <h2>{t(lang, 'chooseTone')}</h2>
            <p className="step-description">{t(lang, 'chooseToneDesc')}</p>
            <div className="options-list">
              {TONES.map(tone => (
                <button
                  key={tone.id}
                  className={`option-btn tone-btn ${preferences.tone === tone.id ? 'selected' : ''}`}
                  onClick={() => updatePreference('tone', tone.id)}
                >
                  <span className="tone-label">{t(lang, tone.labelKey)}</span>
                  <span className="tone-description">{t(lang, tone.descKey)}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="onboarding-step">
            <h2>{t(lang, 'chooseLength')}</h2>
            <p className="step-description">{t(lang, 'chooseLengthDesc')}</p>
            <div className="options-list">
              {STORY_LENGTHS.map(length => (
                <button
                  key={length.id}
                  className={`option-btn length-btn ${preferences.storyLength === length.id ? 'selected' : ''}`}
                  onClick={() => updatePreference('storyLength', length.id)}
                >
                  <span className="length-label">{t(lang, length.labelKey)}</span>
                  <span className="length-description">{t(lang, length.descKey)}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="onboarding-step">
            <h2>{t(lang, 'customTheme')}</h2>
            <p className="step-description">{t(lang, 'customThemeDesc')}</p>
            <input
              type="text"
              className="custom-input"
              placeholder={t(lang, 'customThemePlaceholder')}
              value={preferences.customTheme}
              onChange={(e) => updatePreference('customTheme', e.target.value)}
            />
            <div className="summary">
              <h3>{t(lang, 'yourSettings')}</h3>
              <ul>
                <li><strong>{t(lang, 'language')}:</strong> {preferences.language}</li>
                <li><strong>{t(lang, 'genre')}:</strong> {t(lang, GENRES.find(g => g.id === preferences.genre)?.key)}</li>
                <li><strong>{t(lang, 'tone')}:</strong> {t(lang, TONES.find(to => to.id === preferences.tone)?.labelKey)}</li>
                <li><strong>{t(lang, 'length')}:</strong> {getLengthLabel(preferences.storyLength)}</li>
                {preferences.customTheme && <li><strong>{t(lang, 'theme')}:</strong> {preferences.customTheme}</li>}
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
        <h1>{t(lang, 'appTitle')}</h1>
        <p>{t(lang, 'appSubtitle')}</p>
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
            {t(lang, 'back')}
          </button>
        )}
        {step < 4 ? (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {t(lang, 'next')}
          </button>
        ) : (
          <button
            className="btn btn-primary btn-start"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? t(lang, 'creating') : t(lang, 'beginAdventure')}
          </button>
        )}
      </div>
    </div>
  )
}

export default Onboarding
