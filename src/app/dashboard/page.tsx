'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

function DashboardContent() {
  const router = useRouter()
  const [clients, setClients] = useState<any[]>([])
  const [merchant, setMerchant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const SEUIL_CADEAU = 100 // Points nécessaires pour un cadeau

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // 1. Vérifier qui est connecté via Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/login') // Redirige si non connecté
        return
      }

      // 2. Trouver le commerce lié à ce manager (id_manager)
      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .select('id, name')
        .eq('id_manager', user.id) // TA NOUVELLE COLONNE
        .single()

      if (merchantError || !merchantData) {
        console.error("Aucun commerce lié à ce compte manager.")
        setLoading(false)
        return
      }

      setMerchant(merchantData)

      // 3. Charger les clients de ce commerce précis
      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('merchant_id', merchantData.id)
        .order('created_at', { ascending: false })

      setClients(customers || [])
      setLoading(false)
    }

    checkAuthAndFetch()
  }, [router])

  // FONCTION : Ajouter des points (+10)
  const handleAddPoints = async (clientId: string, currentPoints: number) => {
    setUpdatingId(clientId)
    const { error } = await supabase
      .from('customers')
      .update({ points: currentPoints + 10 })
      .eq('id', clientId)

    if (!error) {
      setClients(clients.map(c => c.id === clientId ? { ...c, points: c.points + 10 } : c))
    }
    setUpdatingId(null)
  }

  // FONCTION : Utiliser un cadeau (-100)
  const handleRedeem = async (clientId: string, currentPoints: number) => {
    if (currentPoints < SEUIL_CADEAU) return
    if (!confirm("Valider l'offre d'un cadeau et déduire 100 points ?")) return

    setUpdatingId(clientId)
    const { error } = await supabase
      .from('customers')
      .update({ points: currentPoints - SEUIL_CADEAU })
      .eq('id', clientId)

    if (!error) {
      setClients(clients.map(c => c.id === clientId ? { ...c, points: c.points - SEUIL_CADEAU } : c))
    }
    setUpdatingId(null)
  }

  // FONCTION : Se déconnecter
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black font-medium">
      Vérification des accès commerçant...
    </div>
  )

  if (!merchant) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <p className="text-red-500 font-bold mb-4">⚠️ Aucun commerce n'est associé à votre compte manager.</p>
      <button onClick={handleLogout} className="text-blue-600 underline">Se déconnecter</button>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 text-black">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{merchant.name}</h1>
          <p className="text-gray-500 font-medium">Tableau de bord de gestion</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 text-right">
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Seuil Fidélité</p>
             <p className="text-lg font-black text-orange-500">{SEUIL_CADEAU} PTS</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-xl transition-all"
          >
            Quitter
          </button>
        </div>
      </header>

      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-widest font-bold">
              <th className="px-8 py-5">Client inscrit</th>
              <th className="px-8 py-5 text-center">Cagnotte</th>
              <th className="px-8 py-5 text-right">Actions caisse</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clients.length === 0 ? (
              <tr><td colSpan={3} className="px-8 py-20 text-center text-gray-400">Aucun client pour le moment.</td></tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/30 transition-all">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900 text-lg">{c.full_name}</p>
                    <p className="text-sm text-gray-400">{c.email || 'Pas d\'email'}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-block px-4 py-2 rounded-2xl font-black text-sm shadow-sm ${
                      c.points >= SEUIL_CADEAU 
                      ? 'bg-green-500 text-white animate-bounce' 
                      : 'bg-orange-100 text-orange-700'
                    }`}>
                      {c.points} PTS
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleAddPoints(c.id, c.points)}
                        disabled={updatingId === c.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg transition-transform active:scale-90 disabled:bg-gray-200"
                      >
                        +10
                      </button>
                      <button 
                        onClick={() => handleRedeem(c.id, c.points)}
                        disabled={updatingId === c.id || c.points < SEUIL_CADEAU}
                        className={`font-bold py-2.5 px-5 rounded-xl shadow-lg transition-all active:scale-90 flex items-center gap-2 ${
                          c.points >= SEUIL_CADEAU 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer' 
                          : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        🎁 {c.points >= SEUIL_CADEAU ? 'OFFRIR' : 'CADEAU'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="p-10 text-center">Chargement...</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}