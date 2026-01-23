import React from 'react'

export default function Q11Screen({ data, updateData, nextScreen }) {
  const options = [
    'School/Work',
    'Fun/Art',
    'New Ideas',
    "Tried it",
    'Never used',
    "What is AI?"
  ]

  const selected = data.q11 || []

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      updateData('q11', selected.filter(o => o !== option))
    } else {
      updateData('q11', [...selected, option])
    }
  }

  return (
    <div className="screen-container">
      <h1>How do you use AI (ChatGPT/Gemini)?</h1>
      <div className="options-container">
        {options.map(option => (
          <button
            key={option}
            className={`pill-btn ${selected.includes(option) ? 'selected' : ''}`}
            onClick={() => toggleOption(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button className="btn-primary" onClick={() => nextScreen('q12')}>
        Next
      </button>
    </div>
  )
}
