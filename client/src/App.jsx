import { useState } from 'react'
import Onboarding from './pages/Onboarding'
import Game from './pages/Game'

function App() {
  const [gameState, setGameState] = useState(null)
  const [preferences, setPreferences] = useState(null)

  const handleStartGame = (prefs, initialState) => {
    setPreferences(prefs)
    setGameState(initialState)
  }

  const handleRestartGame = () => {
    setGameState(null)
    setPreferences(null)
  }

  return (
    <div className="app">
      {!gameState ? (
        <Onboarding onStart={handleStartGame} />
      ) : (
        <Game
          initialState={gameState}
          preferences={preferences}
          onRestart={handleRestartGame}
        />
      )}
    </div>
  )
}

export default App
