import { useState } from 'react'
import { t } from '../services/translations'

function ChoiceButtons({ choices, onChoice, onCustomChoice, disabled, language }) {
  const [showCustom, setShowCustom] = useState(false)
  const [customText, setCustomText] = useState('')

  const handleCustomSubmit = () => {
    if (customText.trim() && onCustomChoice) {
      onCustomChoice(customText.trim())
      setCustomText('')
      setShowCustom(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCustomSubmit()
    }
  }

  if (!choices || choices.length === 0) {
    return null
  }

  return (
    <div className="choice-buttons">
      <h3 className="choice-prompt">{t(language, 'whatWillYouDo')}</h3>
      <div className="choices-list">
        {choices.map((choice) => (
          <button
            key={choice.id}
            className="choice-btn"
            onClick={() => onChoice(choice.id)}
            disabled={disabled}
          >
            <span className="choice-letter">{choice.id}</span>
            <span className="choice-text">{choice.text}</span>
          </button>
        ))}

        {!showCustom ? (
          <button
            className="choice-btn custom-choice-toggle"
            onClick={() => setShowCustom(true)}
            disabled={disabled}
          >
            <span className="choice-letter">✏️</span>
            <span className="choice-text">{t(language, 'writeYourOwn')}</span>
          </button>
        ) : (
          <div className="custom-choice-input">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={t(language, 'customChoicePlaceholder')}
              disabled={disabled}
              onKeyPress={handleKeyPress}
              rows={2}
            />
            <div className="custom-choice-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setShowCustom(false)
                  setCustomText('')
                }}
                disabled={disabled}
              >
                {t(language, 'back')}
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleCustomSubmit}
                disabled={disabled || !customText.trim()}
              >
                {t(language, 'submit')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChoiceButtons
