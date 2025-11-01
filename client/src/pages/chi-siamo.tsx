import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ChiSiamo() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" data-testid="title-chi-siamo">
          Chi Siamo
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-[#C9A054] mb-4">
            TapTrust™ — La Fiducia. Evoluta.
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            TapTrust è un ecosistema digitale che trasforma la reputazione in un asset verificabile.
            Attraverso tecnologia NFC, certifica che ogni recensione provenga da esperienze reali, eliminando le recensioni false e premiando chi costruisce fiducia autentica nel tempo.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Fondata con l'obiettivo di portare trasparenza e autorevolezza nel mondo delle recensioni, TapTrust unisce design, sicurezza e credibilità in un'unica piattaforma scalabile.
          </p>
          
          <div className="bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] p-8 rounded-xl my-8">
            <p className="text-xl font-semibold text-gray-900 mb-3">
              Ogni recensione è verificata.
            </p>
            <p className="text-xl font-semibold text-gray-900 mb-3">
              Ogni interazione è tracciabile.
            </p>
            <p className="text-xl font-semibold text-gray-900">
              Ogni brand è finalmente misurabile per ciò che vale davvero.
            </p>
          </div>
          
          <div className="border-l-4 border-[#C9A054] pl-6 my-8">
            <p className="text-gray-700 mb-2">
              <strong>📍 Sede Operativa:</strong> Veneto, Italia
            </p>
            <p className="text-gray-700 mb-2">
              <strong>📧 Email:</strong> <a href="mailto:info@taptrust.it" className="text-[#C9A054] hover:underline">info@taptrust.it</a>
            </p>
            <p className="text-gray-700">
              <strong>🌐 Sito ufficiale:</strong> <a href="https://www.taptrust.it" className="text-[#C9A054] hover:underline">www.taptrust.it</a>
            </p>
          </div>
          
          <p className="text-center text-gray-600 text-sm mt-12">
            © 2025 TapTrust™ — Reputazione Tangibile. Tutti i diritti riservati.
          </p>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/">
            <Button className="bg-[#C9A054] hover:bg-[#B8904A] text-black font-bold px-8 py-5" data-testid="button-back-home">
              Torna alla Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
