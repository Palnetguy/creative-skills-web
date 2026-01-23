import React from 'react'

export default function Q8Screen({ data, updateData, nextScreen }) {
  const traits = ['Storytelling', 'Video Editing', 'Graphic Design', 'Game Building', 'App Design']
  const ratings = data.q8 || {}

  const setRating = (trait, value) => {
    updateData('q8', { ...ratings, [trait]: value })
  }

  return (
    <div className="screen-container">
      <h1>Rate your interest in:</h1>
      <div className="ratings-container">
        {traits.map(trait => (
          <div key={trait} className="rating-card">
            <span className="rating-label">{trait}</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  className={`star ${ratings[trait] === num ? 'selected' : ''}`}
                  onClick={() => setRating(trait, num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={() => nextScreen('q9')}>
        Next
      </button>
    </div>
  )
}
