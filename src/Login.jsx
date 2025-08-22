// import React from 'react'
// import { Link } from 'react-router-dom'

// export default function Login() {
//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>Hello, welcome to the app!</h1>
//       <p>
//         <Link to="/habits">Go to Habit Tracker</Link>
//       </p>
//     </div>
//   )
// }

import React, { useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) console.error('Error signing in:', error.message)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/habits')
      }
    })
  }, [navigate])

  return (
    <div className="login-page">
      <h1>Hello World</h1>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  )
}