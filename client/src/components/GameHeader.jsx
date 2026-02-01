import { t } from '../services/translations'

function GameHeader({ step, genre, onRestart, language }) {
  return (
    <header className="game-header">
      <div className="header-left">
        <h1 className="game-title" onClick={onRestart} style={{ cursor: 'pointer' }}>
          {t(language, 'appTitle')}
        </h1>
      </div>

      <div className="header-center">
        <div className="step-indicator">
          <span className="step-number">
            {language === 'Chinese'
              ? `${t(language, 'step')}${step}${t(language, 'stepSuffix') || ''}`
              : `${t(language, 'step')} ${step}`}
          </span>
        </div>
      </div>

      <div className="header-right">
        <button className="btn btn-ghost" onClick={onRestart}>
          {t(language, 'newStory')}
        </button>
      </div>
    </header>
  )
}

export default GameHeader
