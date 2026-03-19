'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('merchants')
        .insert([{ name: businessName }])

      if (error) throw error

      setMessage('✅ Succès ! Votre commerce est enregistré.')
      setBusinessName('')
    } catch (error: any) {
      console.error(error)
      setMessage(`❌ Erreur : ${error.message || 'Problème de connexion'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">FideliLocal 🥐</h1>
          <p className="text-gray-500 mt-2">Enregistrez votre commerce pour commencer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              placeholder="Ex: Ma Super Boulangerie"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Création en cours...' : 'Créer mon commerce'}
          </button>
        </form>

        {message && (
          <div className={`p-4 rounded-lg text-sm text-center ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}
      </div>
      
      <footer className="mt-8 text-gray-400 text-sm">
        Connecté à Supabase Local
      </footer>
    </div>
  )
}