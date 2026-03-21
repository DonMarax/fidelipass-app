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

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Tentative de connexion
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert("Accès refusé : Identifiants incorrects.")
      setLoading(false)
    } else {
      // Récupération du rôle pour rediriger au bon endroit
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      
      if (profile?.role === 'admin') router.push('/admin/dashboard')
      else if (profile?.role === 'merchant') router.push('/merchant/dashboard')
      else router.push('/customer/dashboard')
      
      router.refresh()
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6' }}>
      <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '350px' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>FideliPass</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email commerçant" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <button 
            type="submit" 
            disabled={loading} 
            style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Vérification...' : 'SE CONNECTER'}
          </button>
        </form>
      </div>
    </div>
  )
}