import React from 'react'

export default function Q4Screen({ data, updateData, nextScreen }) {
  const handleSelect = (value) => {
    updateData('q4', value)
    nextScreen('q5')
  }

  const options = [
    'Totally (FYP challenges me)',
    'Sometimes (If I trust creator)',
    'Not really (I watch to relax)',
    'No way (Need receipts)'
  ]

  return (
    <div className="screen-container">
      <h1>Have videos ever changed your opinion?</h1>
      <div className="options-container">
        {options.map(option => (
          <button
            key={option}
            className={`pill-btn ${data.q4 === option ? 'selected' : ''}`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
