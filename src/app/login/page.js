// @ts-nocheck
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  async function handleAction(type) {
    setLoading(true)
    const { data, error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      if (type === 'login') {
        router.push('/')
        router.refresh()
      } else {
        alert("Inscription réussie ! Connectez-vous maintenant.")
        setLoading(false)
      }
    }
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>FideliPass</h1>
      <div style={{ maxWidth: '300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px' }} />
        <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px' }} />
        
        <button onClick={() => handleAction('login')} disabled={loading} style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer' }}>
          {loading ? '...' : 'SE CONNECTER'}
        </button>
        
        <button onClick={() => handleAction('register')} disabled={loading} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', cursor: 'pointer' }}>
          {loading ? '...' : 'CRÉER UN COMPTE'}
        </button>
      </div>
    </div>
  )
}