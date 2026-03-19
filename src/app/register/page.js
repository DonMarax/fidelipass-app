'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleRegister = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    
    if (error) {
      alert(error.message)
    } else {
      alert("Compte créé !")
      router.push('/login')
    }
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Créer un compte</h2>
      <form onSubmit={handleRegister} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Mot de passe:</label><br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          S'inscrire
        </button>
      </form>
      <p>
        Déjà un compte ? <Link href="/login">Se connecter</Link>
      </p>
    </div>
  )
}