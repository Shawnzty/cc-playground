import { useState } from 'react'
import { makeChoice } from '../services/api'
import StoryDisplay from '../components/StoryDisplay'
import ChoiceButtons from '../components/ChoiceButtons'
import GameHeader from '../components/GameHeader'

function Game({ initialState, preferences, onRestart }) {
  const [gameState, setGameState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([initialState])

  const handleChoice = async (choiceId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await makeChoice(gameState.sessionId, choiceId)
      setGameState(response)
      setHistory(prev => [...prev, response])
    } catch (err) {
      setError(err.message || 'Failed to continue story')
    } finally {
      setLoading(false)
    }
  }

  const handleViewHistory = () => {
    // Could open a modal with full history
    console.log('History:', history)
  }

  return (
    <div className="game">
      <GameHeader
        step={gameState.step}
        maxSteps={gameState.maxSteps}
        genre={preferences.genre}
        onRestart={onRestart}
        onViewHistory={handleViewHistory}
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
            disabled={loading}
          />
        ) : (
          <div className="ending-section">
            <h2>The End</h2>
            <p>Your adventure has concluded.</p>
            <div className="ending-actions">
              <button className="btn btn-primary" onClick={onRestart}>
                Start New Adventure
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game
