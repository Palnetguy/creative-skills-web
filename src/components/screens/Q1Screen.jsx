import React from 'react'

export default function Q1Screen({ data, updateData, nextScreen }) {
  const handleSelect = (value) => {
    updateData('q1', value)
    nextScreen('q2')
  }

  const options = [
    'My Smartphone',
    'Shared Family Smartphone',
    'Home Computer',
    'Public Laptop',
    'No Regular Access'
  ]

  return (
    <div className="screen-container">
      <h1>What device do you use most for the internet?</h1>
      <div className="options-container">
        {options.map(option => (
          <button
            key={option}
            className={`pill-btn ${data.q1 === option ? 'selected' : ''}`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
