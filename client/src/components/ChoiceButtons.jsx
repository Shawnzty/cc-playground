function ChoiceButtons({ choices, onChoice, disabled }) {
  if (!choices || choices.length === 0) {
    return null
  }

  return (
    <div className="choice-buttons">
      <h3 className="choice-prompt">What will you do?</h3>
      <div className="choices-list">
        {choices.map((choice, index) => (
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
      </div>
    </div>
  )
}

export default ChoiceButtons
