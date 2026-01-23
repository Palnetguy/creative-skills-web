import React from 'react'

export default function IntroScreen({ nextScreen }) {
  const shareSurvey = (platform) => {
    const url = window.location.href
    const text = 'Hey! Help us build a creative digital skills program. Take this quick survey:'

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Survey link copied to clipboard!')
      })
    }
  }

  return (
    <div className="screen-container">
      <h1 style={{ marginTop: '60px' }}>Help us build a creative digital skills program!</h1>
      <p className="subtitle">
        Anonymous & fast. Your voice matters in shaping the future of digital education.
      </p>

      <button className="btn-primary" onClick={() => nextScreen('q1')}>
        Get Started
      </button>

      <div className="share-container">
        <button className="share-btn" onClick={() => shareSurvey('whatsapp')}>
          <span>🟢</span> WhatsApp
        </button>
        <button className="share-btn" onClick={() => shareSurvey('link')}>
          <span>🔗</span> Copy Link
        </button>
      </div>
    </div>
  )
}
