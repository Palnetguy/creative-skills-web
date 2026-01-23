import React from 'react'

export default function Q5Screen({ data, updateData, nextScreen }) {
  const options = [
    'Social Media (YouTube/TikTok)',
    'Formal School',
    'Online Courses',
    'Friends/Family',
    "I don't know where to start"
  ]

  const selected = data.q5 || []

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      updateData('q5', selected.filter(o => o !== option))
    } else {
      updateData('q5', [...selected, option])
    }
  }

  return (
    <div className="screen-container">
      <h1>Where do you learn new skills?</h1>
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
      <button className="btn-primary" onClick={() => nextScreen('q6')}>
        Next
      </button>
    </div>
  )
}
