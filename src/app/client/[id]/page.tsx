'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfilClient() {
  const { id } = useParams() // On récupère l'ID du client directement dans l'URL
  const [client, setClient] = useState<any>(null)
  const [merchant, setMerchant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Configuration du palier de récompense (ex: 100 points = un cadeau)
  const palierReference = 100 

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const fetchData = async () => {
    // 1. Récupérer les infos du client
    const { data: customerData } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()

    if (customerData) {
      setClient(customerData)
      
      // 2. Récupérer le nom du commerce associé
      const { data: merchantData } = await supabase
        .from('merchants')
        .select('name')
        .eq('id', customerData.merchant_id)
        .single()
      
      setMerchant(merchantData)
    }
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Chargement de votre carte...</div>
  if (!client) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">⚠️ Client introuvable.</div>

  const progression = Math.min((client.points / palierReference) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 p-6 flex flex-col items-center">
      {/* En-tête */}
      <div className="w-full max-w-sm text-center mb-8 mt-4">
        <h1 className="text-white text-3xl font-black italic uppercase tracking-tighter">
          {merchant?.name || 'Ma Fidélité'}
        </h1>
        <p className="text-blue-100 opacity-80 uppercase text-xs font-bold tracking-widest mt-1">
          Carte de fidélité numérique
        </p>
      </div>

      {/* Carte de Fidélité */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-gray-400 text-sm font-medium mb-1">Bonjour,</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{client.full_name}</h2>
          
          {/* Cercle ou Score central */}
          <div className="relative inline-block mb-6">
             <div className="text-6xl font-black text-blue-600 leading-none">
               {client.points}
             </div>
             <div className="text-gray-400 font-bold text-sm uppercase mt-2">Points cumulés</div>
          </div>

          {/* Barre de progression */}
          <div className="mt-4 mb-2">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
              <span>PROGRÈS</span>
              <span>{client.points} / {palierReference} PTS</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-100 shadow-inner">
              <div 
                className="bg-gradient-to-r from-orange-400 to-orange-500 h-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${progression}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-gray-500 text-xs mt-4 italic">
            {client.points >= palierReference 
              ? "🎉 Félicitations ! Votre récompense est prête." 
              : `Plus que ${palierReference - client.points} points pour votre cadeau !`}
          </p>
        </div>

        {/* Pied de carte */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center">
          <div className="text-left">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Membre depuis</p>
            <p className="text-sm font-bold text-gray-700">{new Date(client.created_at).toLocaleDateString()}</p>
          </div>
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
             <span className="text-blue-600 text-xl font-bold">🎁</span>
          </div>
        </div>
      </div>

      <button 
        onClick={fetchData}
        className="mt-10 text-white/60 text-sm hover:text-white transition-colors"
      >
        🔄 Actualiser mes points
      </button>
    </div>
  )
}