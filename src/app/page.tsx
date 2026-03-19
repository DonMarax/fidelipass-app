'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif' 
    }}>
      <h1>Bienvenue sur FideliPass</h1>
      <p>Gérez vos cartes de fidélité en toute simplicité.</p>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <Link href="/login" style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none'
        }}>
          Se connecter
        </Link>
        
        <Link href="/register" style={{
          padding: '10px 20px',
          border: '1px solid #0070f3',
          color: '#0070f3',
          borderRadius: '5px',
          textDecoration: 'none'
        }}>
          Créer un compte
        </Link>
      </div>
    </div>
  )
}