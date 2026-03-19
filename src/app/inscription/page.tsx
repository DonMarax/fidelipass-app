'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'

// On crée un petit sous-composant pour le formulaire
function FormulaireInscription() {
  const searchParams = useSearchParams()
  const merchantId = searchParams.get('merchant_id')

  const [formData, setFormData] = useState({ name: '', email: '' })
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!merchantId) {
      setError("Erreur : Aucun commerçant identifié.")
      return
    }

    setLoading(true)
    try {
      const { data, error: insertError } = await supabase
        .from('customers')
        .insert([{ 
          full_name: formData.name, 
          email: formData.email, 
          merchant_id: merchantId 
        }])
        .select()
        .single()

      if (insertError) throw insertError
      setCustomer(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (customer) {
    return (
      <div className="text-center p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Bienvenue !</h2>
        <div className="inline-block p-4 border-4 border-blue-500 rounded-lg bg-white mb-4">
          <QRCodeSVG value={customer.id} size={180} />
        </div>
        <p className="text-gray-600 font-medium">{customer.full_name}</p>
        <p className="text-xs text-gray-400 mt-2">ID: {customer.id}</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Inscription Fidélité</h1>
      <form onSubmit={handleInscription} className="space-y-4">
        <input
          type="text"
          placeholder="Votre Nom"
          required
          className="w-full p-3 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Votre Email (Optionnel)"
          className="w-full p-3 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading || !merchantId}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300"
        >
          {loading ? 'Chargement...' : 'Obtenir ma carte'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
      {!merchantId && <p className="mt-4 text-orange-500 text-xs text-center">⚠️ Lien invalide (ID commerçant manquant)</p>}
    </div>
  )
}

// Le composant principal qui "enveloppe" tout pour éviter les erreurs Next.js
export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Suspense fallback={<div>Chargement du formulaire...</div>}>
        <FormulaireInscription />
      </Suspense>
    </div>
  )
}