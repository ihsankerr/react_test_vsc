import React from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Hello, welcome to the app!</h1>
      <p>
        <Link to="/habits">Go to Habit Tracker</Link>
      </p>
    </div>
  )
}
