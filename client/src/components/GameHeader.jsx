import { useState, useEffect, useRef } from 'react'
import { t } from '../services/translations'

function GameHeader({ step, onRestart, onRollback, language, history }) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleStepClick = () => {
    if (step > 1) {
      setShowMenu(!showMenu)
    }
  }

  const handleRollback = (targetStep) => {
    setShowMenu(false)
    onRollback(targetStep)
  }

  return (
    <header className="game-header">
      <div className="header-left">
        <h1 className="game-title" onClick={onRestart}>
          {t(language, 'appTitle')}
        </h1>
      </div>

      <div className="header-center" ref={menuRef}>
        <div
          className={`step-indicator ${step > 1 ? 'clickable' : ''}`}
          onClick={handleStepClick}
        >
          <span className="step-number">
            {language === 'Chinese'
              ? `${t(language, 'step')}${step}${t(language, 'stepSuffix') || ''}`
              : `${t(language, 'step')} ${step}`}
          </span>
          {step > 1 && <span className="step-arrow">{showMenu ? '▲' : '▼'}</span>}
        </div>

        {showMenu && history && history.length > 1 && (
          <div className="rollback-menu">
            <div className="rollback-title">{t(language, 'rollbackTitle')}</div>
            <div className="rollback-list">
              {history.slice(0, -1).map((item) => (
                <button
                  key={item.step}
                  className="rollback-item"
                  onClick={() => handleRollback(item.step)}
                >
                  <span className="rollback-step">
                    {language === 'Chinese'
                      ? `${t(language, 'rollbackTo')}${item.step}${t(language, 'stepSuffix') || ''}`
                      : `${t(language, 'rollbackTo')} ${item.step}`}
                  </span>
                  <span className="rollback-summary">{item.summary}</span>
                </button>
              ))}
            </div>
          </div>
        )}
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
