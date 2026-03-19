'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [merchants, setMerchants] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      // 1. Vérifier si l'utilisateur est bien admin
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        alert("Accès refusé : Vous n'êtes pas administrateur.")
        router.push('/')
        return
      }

      // 2. Charger les marchands
      const { data } = await supabase.from('merchants').select('*')
      setMerchants(data || [])
      setLoading(false)
    }

    checkAdminAndFetch()
  }, [])

  const deleteMerchant = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer ce marchand ?")) {
      const { error } = await supabase.from('merchants').delete().eq('id', id)
      if (!error) {
        setMerchants(merchants.filter(m => m.id !== id))
      } else {
        alert("Erreur lors de la suppression")
      }
    }
  }

  if (loading) return <p style={{ padding: '20px' }}>Chargement du panneau de contrôle...</p>

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>👑 Console Super Admin</h1>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))}>Déconnexion</button>
      </div>
      <hr />
      
      <h3>Gestion des Marchands ({merchants.length})</h3>
      <div style={{ display: 'grid', gap: '15px' }}>
        {merchants.map(m => (
          <div key={m.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
            <div>
              <strong>{m.name}</strong><br />
              <small>{m.address || 'Pas d\'adresse'}</small>
            </div>
            <button 
              onClick={() => deleteMerchant(m.id)}
              style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Supprimer le compte
            </button>
          </div>
        ))}
      </div>

      {merchants.length === 0 && <p>Aucun marchand trouvé pour le moment.</p>}
    </div>
  )
}