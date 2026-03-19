'use client'

import { useEffect, useState, Suspense } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'

function ScannerContent() {
  const searchParams = useSearchParams()
  const merchantId = searchParams.get('merchant_id')
  
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [status, setStatus] = useState<'attente' | 'succès' | 'erreur'>('attente')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!merchantId) return

    // Configuration du scanner
    const scanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    )

    const onScanSuccess = async (decodedText: string) => {
      // On arrête le scan temporairement pour éviter les doubles lectures
      setScanResult(decodedText)
      setStatus('attente')
      setMessage('Traitement du client...')

      try {
        // 1. On récupère les points actuels du client
        const { data: client, error: fetchError } = await supabase
          .from('customers')
          .select('id, points, full_name')
          .eq('id', decodedText)
          .eq('merchant_id', merchantId) // Sécurité : le client doit appartenir au commerçant
          .single()

        if (fetchError || !client) throw new Error("Client introuvable ou mauvais commerce")

        // 2. On ajoute les 10 points
        const { error: updateError } = await supabase
          .from('customers')
          .update({ points: client.points + 10 })
          .eq('id', client.id)

        if (updateError) throw updateError

        setStatus('succès')
        setMessage(`✅ +10 points pour ${client.full_name} ! (Total: ${client.points + 10})`)
        
        // On réinitialise après 3 secondes pour scanner le suivant
        setTimeout(() => {
          setScanResult(null)
          setStatus('attente')
          setMessage('')
        }, 3000)

      } catch (err: any) {
        setStatus('erreur')
        setMessage(err.message)
        setTimeout(() => setScanResult(null), 3000)
      }
    }

    scanner.render(onScanSuccess, (err) => {
        // On ignore les erreurs de lecture (quand il ne voit pas de QR code)
    })

    return () => {
      scanner.clear() // Nettoyage quand on quitte la page
    }
  }, [merchantId])

  if (!merchantId) return <div className="p-10 text-center text-red-500 font-bold">⚠️ ID Commerçant requis pour scanner.</div>

  return (
    <div className="max-w-md mx-auto flex flex-col items-center">
      <h1 className="text-2xl font-black mb-6 text-gray-800 uppercase tracking-tight">Scanner Fidélité</h1>
      
      {/* Zone de la caméra */}
      <div id="reader" className="w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white"></div>

      {/* Affichage du résultat */}
      {scanResult && (
        <div className={`mt-8 p-6 rounded-2xl w-full text-center shadow-lg transition-all ${
          status === 'succès' ? 'bg-green-500 text-white' : 
          status === 'erreur' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
        }`}>
          <p className="font-bold text-lg">{message}</p>
        </div>
      )}

      {!scanResult && (
        <p className="mt-6 text-gray-400 text-sm animate-pulse italic">
          Placez le QR Code du client face à la caméra...
        </p>
      )}
    </div>
  )
}

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Suspense fallback={<div>Chargement de la caméra...</div>}>
        <ScannerContent />
      </Suspense>
    </div>
  )
}