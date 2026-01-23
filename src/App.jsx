import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SurveyApp from './pages/SurveyApp'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function App() {
  const [showAdmin, setShowAdmin] = useState(false)

  // Admin access via URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === 'true') {
      setShowAdmin(true)
    }
  }, [])

  if (showAdmin) {
    return <AdminDashboard />
  }

  return <SurveyApp />
}

export default App
