// @ts-nocheck
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Fonction pour se connecter
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      alert("Erreur connexion : " + error.message)
      setLoading(false)
    } else {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role === 'admin') router.push('/admin/dashboard')
      else if (profile?.role === 'merchant') router.push('/merchant/dashboard')
      else router.push('/customer/dashboard')
      router.refresh()
    }
  }

  // Fonction pour s'inscrire
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })

    if (error) {
      alert("Erreur inscription : " + error.message)
    } else {
      alert("Compte créé avec succès ! Connectez-vous maintenant juste au-dessus.")
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '400px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#0070f3' }}>FideliPass</h1>

      {/* --- BLOC CONNEXION --- */}
      <div style={{ padding: '20px', border: '2px solid #0070f3', borderRadius: '10px', marginBottom: '30px' }}>
        <h2 style={{ marginTop: 0 }}>Se connecter</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px' }} />
          <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px' }} />
          <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Chargement...' : 'CONNEXION'}
          </button>
        </form>
      </div>

      <hr />

      {/* --- BLOC INSCRIPTION --- */}
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', marginTop: '30px', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ marginTop: 0 }}>Nouveau ici ? Créer un compte</h3>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px' }} />
          <input type="password" placeholder="Choisir un mot de passe" onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px' }} />
          <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
            CRÉER MON COMPTE
          </button>
        </form>
      </div>
    </div>
  )
}