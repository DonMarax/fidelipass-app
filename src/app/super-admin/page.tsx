'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SuperAdmin() {
  const [merchants, setMerchants] = useState<any[]>([])
  const [newMerchantName, setNewMerchantName] = useState('')

  useEffect(() => {
    fetchMerchants()
  }, [])

  async function fetchMerchants() {
    const { data } = await supabase.from('merchants').select('*')
    if (data) setMerchants(data)
  }

  async function createMerchant() {
    // Ici, tu pourras créer un nouveau commerce et générer son ID de gérant
    const { error } = await supabase
      .from('merchants')
      .insert([{ name: newMerchantName }])
    
    if (!error) {
      setNewMerchantName('')
      fetchMerchants()
    }
  }

  return (
    <div className="p-10 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-black mb-8">🛠️ SYSTEM ADMIN</h1>
      
      <div className="bg-gray-900 p-6 rounded-2xl mb-10">
        <h2 className="text-xl font-bold mb-4">Ajouter un nouveau commerce</h2>
        <div className="flex gap-4">
          <input 
            className="bg-gray-800 p-3 rounded-lg flex-1 outline-none border border-gray-700 focus:border-blue-500"
            placeholder="Nom du commerce (ex: Boulangerie Dupont)"
            value={newMerchantName}
            onChange={(e) => setNewMerchantName(e.target.value)}
          />
          <button onClick={createMerchant} className="bg-blue-600 px-6 py-3 rounded-lg font-bold">Créer</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {merchants.map(m => (
          <div key={m.id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <p className="text-blue-400 font-mono text-xs mb-1">ID: {m.id}</p>
            <h3 className="text-xl font-bold">{m.name}</h3>
            <p className="text-gray-400 text-sm mt-2">Manager ID: {m.id_manager || 'Non lié'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}