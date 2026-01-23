import React from 'react'

export default function Q6Screen({ data, updateData, nextScreen }) {
  const options = [
    'Career/Job',
    'Entrepreneurship',
    'Solve Community Problems',
    'Hobby/Fun',
    'Schoolwork',
    'Culture/History'
  ]

  const selected = data.q6 || []

  const toggleOption = (option) => {
    const max = 3
    if (selected.includes(option)) {
      updateData('q6', selected.filter(o => o !== option))
    } else {
      if (selected.length < max) {
        updateData('q6', [...selected, option])
      } else {
        alert(`Maximum ${max} options allowed.`)
      }
    }
  }

  return (
    <div className="screen-container">
      <h1>Why do you want digital skills?</h1>
      <p className="multi-hint">Select up to 3 options</p>
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
      <button className="btn-primary" onClick={() => nextScreen('q7')}>
        Next
      </button>
    </div>
  )
}
