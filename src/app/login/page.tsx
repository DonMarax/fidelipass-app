'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Connexion de l'utilisateur
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      alert("Erreur de connexion : " + authError.message)
      return
    }

    if (user) {
      // 2. Récupérer le rôle dans la table profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error(profileError)
        return
      }

      // 3. Redirection intelligente selon le rôle
      if (profile?.role === 'admin') {
        router.push('/admin/dashboard')
      } else if (profile?.role === 'merchant') {
        router.push('/merchant/dashboard')
      } else {
        router.push('/customer/dashboard')
      }
      
      router.refresh()
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Connexion FideliPass</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          Se connecter
        </button>
      </form>
    </div>
  )
}