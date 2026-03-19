'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("Identifiants invalides. Vérifiez votre email et mot de passe.")
    } else {
      // Une fois connecté, on va sur le dashboard
      // Note : On n'a plus besoin de passer l'ID dans l'URL !
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-black text-gray-900 mb-2 text-center uppercase tracking-tighter">Espace Commerçant</h1>
        <p className="text-gray-400 text-center mb-8 text-sm font-medium">Connectez-vous pour gérer vos clients</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Email professionnel</label>
            <input
              type="email"
              placeholder="boulangerie@exemple.com"
              required
              className="w-full p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 text-black outline-none focus:border-blue-500 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 text-black outline-none focus:border-blue-500 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:bg-gray-300"
          >
            {loading ? 'Connexion...' : 'SE CONNECTER'}
          </button>
        </form>

        {error && <p className="mt-6 text-red-500 text-sm text-center font-bold bg-red-50 p-3 rounded-xl">{error}</p>}
      </div>
    </div>
  )
}