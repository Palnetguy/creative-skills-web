import React, { useState } from 'react'

export default function Q10Screen({ data, updateData, nextScreen }) {
  const [text, setText] = useState(data.q10 || '')

  const handleNext = () => {
    updateData('q10', text)
    nextScreen('q11')
  }

  return (
    <div className="screen-container">
      <h1>Biggest challenge facing your community?</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your answer here..."
        className="textarea-input"
      />
      <button className="btn-primary" onClick={handleNext}>
        Next
      </button>
    </div>
  )
}
