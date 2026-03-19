// @ts-nocheck
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  async function handleAuth(type) {
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.message)
    } else {
      alert(type === 'login' ? "Connecté !" : "Compte créé !")
      router.push('/')
      router.refresh()
    }
  }

  return (
    <main style={{ padding: '20px', textAlign: 'center' }}>
      <h1>FideliPass</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', margin: '10px auto' }} />
      <input type="password" placeholder="Pass" onChange={(e) => setPassword(e.target.value)} style={{ display: 'block', margin: '10px auto' }} />
      <button onClick={() => handleAuth('login')} style={{ background: 'blue', color: 'white' }}>LOGIN</button>
      <button onClick={() => handleAuth('register')} style={{ background: 'green', color: 'white', marginLeft: '10px' }}>REGISTER</button>
    </main>
  )
}