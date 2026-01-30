function GameHeader({ step, maxSteps, genre, onRestart, onViewHistory }) {
  const progressPercent = maxSteps === 'unlimited'
    ? 0
    : Math.min((step / maxSteps) * 100, 100)

  return (
    <header className="game-header">
      <div className="header-left">
        <h1 className="game-title">AI Story Adventure</h1>
        <span className="genre-badge">{genre}</span>
      </div>

      <div className="header-center">
        <div className="step-indicator">
          <span className="step-number">Step {step}</span>
          {maxSteps !== 'unlimited' && (
            <span className="step-max">/ {maxSteps}</span>
          )}
        </div>
        {maxSteps !== 'unlimited' && (
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      <div className="header-right">
        <button className="btn btn-ghost" onClick={onRestart}>
          New Story
        </button>
      </div>
    </header>
  )
}

export default GameHeader
