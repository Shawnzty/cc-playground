import { useState } from 'react'
import { makeChoice, makeCustomChoice, rollbackToStep } from '../services/api'
import { t } from '../services/translations'
import StoryDisplay from '../components/StoryDisplay'
import ChoiceButtons from '../components/ChoiceButtons'
import GameHeader from '../components/GameHeader'

function Game({ initialState, preferences, onRestart }) {
  const [gameState, setGameState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // History with summaries for rollback menu
  const [history, setHistory] = useState([{
    step: 1,
    summary: initialState.summary || initialState.storyText.substring(0, 50) + '...',
    storyText: initialState.storyText,
  }])

  const language = preferences.language

  const handleChoice = async (choiceId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await makeChoice(gameState.sessionId, choiceId)
      setGameState(response)
      setHistory(prev => [...prev, {
        step: response.step,
        summary: response.summary || response.storyText.substring(0, 50) + '...',
        storyText: response.storyText,
      }])
    } catch (err) {
      setError(err.message || 'Failed to continue story')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomChoice = async (customText) => {
    setLoading(true)
    setError(null)

    try {
      const response = await makeCustomChoice(gameState.sessionId, customText)
      setGameState(response)
      setHistory(prev => [...prev, {
        step: response.step,
        summary: response.summary || response.storyText.substring(0, 50) + '...',
        storyText: response.storyText,
      }])
    } catch (err) {
      setError(err.message || 'Failed to continue story')
    } finally {
      setLoading(false)
    }
  }

  const handleRollback = async (targetStep) => {
    setLoading(true)
    setError(null)

    try {
      const response = await rollbackToStep(gameState.sessionId, targetStep)
      setGameState(response)
      // Truncate local history to match
      setHistory(prev => prev.slice(0, targetStep))
    } catch (err) {
      setError(err.message || 'Failed to rollback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="game">
      <GameHeader
        step={gameState.step}
        onRestart={onRestart}
        onRollback={handleRollback}
        language={language}
        history={history}
      />

      <div className="game-content">
        <StoryDisplay
          storyText={gameState.storyText}
          imageUrl={gameState.imageUrl}
          isLoading={loading}
        />

        {error && <div className="error-message">{error}</div>}

        {!gameState.isEnding ? (
          <ChoiceButtons
            choices={gameState.choices}
            onChoice={handleChoice}
            onCustomChoice={handleCustomChoice}
            disabled={loading}
            language={language}
          />
        ) : (
          <div className="ending-section">
            <h2>{t(language, 'theEnd')}</h2>
            <p>{t(language, 'adventureConcluded')}</p>
            <div className="ending-actions">
              <button className="btn btn-primary" onClick={onRestart}>
                {t(language, 'startNew')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game
