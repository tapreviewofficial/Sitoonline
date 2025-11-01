import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Contatti() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" data-testid="title-contatti">
          Contatti
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Hai domande, richieste o desideri una collaborazione con noi?<br />
            Il nostro team è a disposizione per assisterti in ogni fase.
          </p>
          
          <div className="bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] p-8 rounded-xl my-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📩</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email generale</h3>
                  <a href="mailto:info@taptrust.it" className="text-[#C9A054] text-lg hover:underline" data-testid="link-email">
                    info@taptrust.it
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Sede Operativa</h3>
                  <p className="text-gray-700 text-lg">Veneto, Italia</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🌐</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Sito ufficiale</h3>
                  <a href="https://www.taptrust.it" className="text-[#C9A054] text-lg hover:underline" data-testid="link-website">
                    www.taptrust.it
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-l-4 border-[#C9A054] pl-6 my-8">
            <p className="text-lg text-gray-700 font-semibold">
              TapTrust risponde entro 24 ore lavorative.
            </p>
            <p className="text-lg text-[#C9A054] font-bold mt-2">
              La fiducia è la nostra valuta.
            </p>
          </div>
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
