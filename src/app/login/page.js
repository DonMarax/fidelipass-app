// @ts-nocheck
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true) // Switch entre Connexion et Inscription
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (isLogin) {
      // --- LOGIQUE CONNEXION ---
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        alert("Erreur de connexion : " + error.message)
        setLoading(false)
      } else {
        // Redirection selon le rôle
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
        if (profile?.role === 'admin') router.push('/admin/dashboard')
        else if (profile?.role === 'merchant') router.push('/merchant/dashboard')
        else router.push('/customer/dashboard')
        router.refresh()
      }
    } else {
      // --- LOGIQUE INSCRIPTION ---
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })

      if (error) {
        alert("Erreur d'inscription : " + error.message)
        setLoading(false)
      } else {
        alert("Compte créé ! Vous pouvez maintenant vous connecter.")
        setIsLogin(true) // On repasse sur le formulaire de connexion
        setLoading(false)
      }
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>FideliPass</h1>
        <h2 style={styles.subtitle}>{isLogin ? 'Connexion' : 'Créer un compte'}</h2>

        <form onSubmit={handleAuth} style={styles.form}>
          <input 
            type="email" 
            placeholder="Votre email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input}
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={isLogin ? styles.btnLogin : styles.btnRegister}>
            {loading ? 'Patientez...' : (isLogin ? 'Se connecter' : "S'inscrire")}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{ color: '#666' }}>
            {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={styles.switchBtn}
          >
            {isLogin ? "Créer un compte gratuitement" : "Se connecter à mon compte"}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7fb', fontFamily: 'sans-serif' },
  card: { padding: '40px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '380px', textAlign: 'center' },
  title: { color: '#0070f3', fontSize: '28px', marginBottom: '5px' },
  subtitle: { color: '#333', fontSize: '18px', marginBottom: '30px', fontWeight: '400' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' },
  btnLogin: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#0070f3', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  btnRegister: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#28a745', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
  footer: { marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' },
  switchBtn: { background: 'none', border: 'none', color: '#0070f3', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '5px' }
}