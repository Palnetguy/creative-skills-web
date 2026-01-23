import React from 'react'

export default function Q9Screen({ data, updateData, nextScreen }) {
  const traits = ['Climate Change', 'Online Safety', 'Entrepreneurship', 'Mental Health', 'Gender Equality']
  const ratings = data.q9 || {}

  const setRating = (trait, value) => {
    updateData('q9', { ...ratings, [trait]: value })
  }

  return (
    <div className="screen-container">
      <h1>Rate importance of:</h1>
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
      <button className="btn-primary" onClick={() => nextScreen('q10')}>
        Next
      </button>
    </div>
  )
}
